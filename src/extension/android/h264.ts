export interface AccessUnit {
  key: boolean;
  /** Codec do último SPS visto (`avc1.PPCCLL`). */
  codec: string | undefined;
  /** NAL units em Annex B, cada uma com start code de 4 bytes. */
  data: Uint8Array;
}

const startCode = Uint8Array.of(0, 0, 0, 1);

const nalType = {
  slice: 1,
  idr: 5,
  sps: 7,
} as const;

/**
 * Parser incremental de H.264 Annex B que agrupa NAL units em access units (um frame cada).
 *
 * Annex B não tem tamanho: uma NAL só termina quando o próximo start code aparece. Como o
 * `screenrecord` escreve um frame por vez e fica quieto quando a tela não muda, quem usa o
 * parser chama `flush()` quando o stream fica ocioso para liberar o último frame.
 */
export class AnnexBParser {
  private buffer: Uint8Array = new Uint8Array(0);
  private unit: Uint8Array[] = [];
  private unitHasSlice = false;
  private unitIsKey = false;
  private codec: string | undefined;

  constructor(
    private readonly onAccessUnit: (unit: AccessUnit) => void,
    /** Bytes que não começam num start code: o stream foi truncado ou não é vídeo. */
    private readonly onDesync: (skipped: Uint8Array) => void,
  ) {}

  push(chunk: Uint8Array): void {
    this.buffer = this.buffer.length === 0 ? chunk : concat([this.buffer, chunk]);
    const starts = findStartCodes(this.buffer);
    const first = starts[0];
    if (first === undefined) {
      // Pode ser um start code partido entre chunks; sem nenhum, espera mais dados.
      return;
    }
    if (first.index > 0) this.onDesync(this.buffer.subarray(0, first.index));
    for (let i = 0; i < starts.length - 1; i++) {
      const current = starts[i];
      const next = starts[i + 1];
      if (current && next) this.handleNal(this.buffer.subarray(current.payload, next.index));
    }
    const last = starts[starts.length - 1];
    if (last) this.buffer = this.buffer.slice(last.index);
  }

  /** Trata o que sobrou no buffer como NAL completa e libera o access unit pendente. */
  flush(): void {
    const first = findStartCodes(this.buffer)[0];
    if (first) {
      if (first.index > 0) this.onDesync(this.buffer.subarray(0, first.index));
      this.handleNal(this.buffer.subarray(first.payload));
    } else if (this.buffer.length > 0) {
      this.onDesync(this.buffer);
    }
    this.buffer = new Uint8Array(0);
    this.emitUnit();
  }

  private handleNal(raw: Uint8Array): void {
    const nal = trimTrailingZeros(raw);
    const header = nal[0];
    if (header === undefined) return;
    const type = header & 0x1f;
    if (type === nalType.slice || type === nalType.idr) {
      // `first_mb_in_slice` é ue(v); o bit 1 logo após o header significa 0, ou seja, a
      // primeira fatia de um frame novo.
      const firstSlice = ((nal[1] ?? 0) & 0x80) !== 0;
      if (firstSlice && this.unitHasSlice) this.emitUnit();
      this.unitHasSlice = true;
      if (type === nalType.idr) this.unitIsKey = true;
    } else {
      // SPS, PPS, SEI e AUD vêm antes das fatias do frame a que pertencem.
      if (this.unitHasSlice) this.emitUnit();
      if (type === nalType.sps) this.codec = codecFromSps(nal);
    }
    this.unit.push(startCode, nal);
  }

  private emitUnit(): void {
    if (!this.unitHasSlice) return;
    const unit: AccessUnit = { key: this.unitIsKey, codec: this.codec, data: concat(this.unit) };
    this.unit = [];
    this.unitHasSlice = false;
    this.unitIsKey = false;
    this.onAccessUnit(unit);
  }
}

interface StartCode {
  index: number;
  payload: number;
}

function findStartCodes(buffer: Uint8Array): StartCode[] {
  const found: StartCode[] = [];
  for (let i = 2; i < buffer.length; i++) {
    if (buffer[i] !== 1 || buffer[i - 1] !== 0 || buffer[i - 2] !== 0) continue;
    const index = i >= 3 && buffer[i - 3] === 0 ? i - 3 : i - 2;
    found.push({ index, payload: i + 1 });
  }
  return found;
}

// Uma NAL termina com o bit de parada do RBSP, então zeros no fim são padding entre NALs
// (ou o primeiro byte de um start code de 4 bytes).
function trimTrailingZeros(nal: Uint8Array): Uint8Array {
  let end = nal.length;
  while (end > 0 && nal[end - 1] === 0) end--;
  return nal.subarray(0, end);
}

function codecFromSps(sps: Uint8Array): string | undefined {
  if (sps.length < 4) return undefined;
  const hex = (byte: number | undefined) => (byte ?? 0).toString(16).padStart(2, '0');
  return `avc1.${hex(sps[1])}${hex(sps[2])}${hex(sps[3])}`;
}

// Sempre aloca um buffer novo (fora do pool do Node), para o `postMessage` não levar junto
// memória que não é do frame.
function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((total, part) => total + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
