import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from 'react';
import type { Rotation } from '../../shared/device';
import type { HostToWebview } from '../../shared/protocol';
import { type Point, toClampedPoint, toNaturalPoint, toNormalizedPoint } from '../geometry';
import { onHostMessage, postToHost } from '../vscodeApi';

const specialKeys = new Set([
  'Backspace',
  'Delete',
  'Enter',
  'Tab',
  'Escape',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown',
]);

const viewportDebounceMs = 150;

// Fila maior que isso significa que o decoder não acompanha: melhor pedir um keyframe novo
// do que mostrar a tela com segundos de atraso.
const maxDecodeQueue = 6;

interface Decoder {
  decoder: VideoDecoder;
  rotation: Rotation;
  waitingKey: boolean;
  produced: boolean;
}

type VideoConfigMessage = Extract<HostToWebview, { type: 'videoConfig' }>;

export function DeviceScreen({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const decoderRef = useRef<Decoder | undefined>(undefined);
  // Rotação da imagem que está na tela, para converter o toque.
  const rotationRef = useRef<Rotation>(0);
  const gesture = useRef<{ mirror: boolean } | undefined>(undefined);
  const lastPointer = useRef<{ clientX: number; clientY: number } | undefined>(undefined);
  const [pinchDots, setPinchDots] = useState<[Point, Point] | undefined>(undefined);

  useEffect(() => {
    const closeDecoder = () => {
      const current = decoderRef.current;
      decoderRef.current = undefined;
      if (current && current.decoder.state !== 'closed') current.decoder.close();
    };

    const configure = (message: VideoConfigMessage) => {
      closeDecoder();
      const entry: Decoder = {
        decoder: new VideoDecoder({
          output: (frame) => {
            const canvas = canvasRef.current;
            const context = canvas?.getContext('2d');
            if (canvas && context && decoderRef.current === entry) {
              if (canvas.width !== frame.displayWidth) canvas.width = frame.displayWidth;
              if (canvas.height !== frame.displayHeight) canvas.height = frame.displayHeight;
              context.drawImage(frame, 0, 0);
              rotationRef.current = entry.rotation;
              entry.produced = true;
            }
            frame.close();
          },
          error: () => {
            if (decoderRef.current !== entry) return;
            decoderRef.current = undefined;
            // Falhar antes do primeiro frame indica codec não suportado, não um erro passageiro.
            postToHost({ type: entry.produced ? 'videoReset' : 'videoUnsupported' });
          },
        }),
        rotation: message.rotation,
        waitingKey: true,
        produced: false,
      };
      decoderRef.current = entry;
      // Sem `description`: o stream é Annex B, com SPS/PPS dentro dos keyframes.
      entry.decoder.configure({ codec: message.codec, optimizeForLatency: true });
    };

    const unsubscribe = onHostMessage((message) => {
      switch (message.type) {
        case 'videoConfig':
          configure(message);
          return;
        case 'videoChunk': {
          const entry = decoderRef.current;
          if (entry?.decoder.state !== 'configured') return;
          if (entry.waitingKey && !message.key) return;
          if (entry.decoder.decodeQueueSize > maxDecodeQueue) {
            closeDecoder();
            postToHost({ type: 'videoReset' });
            return;
          }
          entry.waitingKey = false;
          entry.decoder.decode(
            new EncodedVideoChunk({
              type: message.key ? 'key' : 'delta',
              timestamp: message.timestamp,
              data: message.data,
            }),
          );
          return;
        }
        case 'clearScreen': {
          closeDecoder();
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
          }
          return;
        }
        case 'frame': {
          // O host caiu para RGBA; um decoder que sobrou só desenharia por cima.
          closeDecoder();
          const canvas = canvasRef.current;
          const context = canvas?.getContext('2d');
          const { buffer, byteOffset, byteLength } = message.data;
          if (canvas && context && buffer instanceof ArrayBuffer) {
            if (canvas.width !== message.width) canvas.width = message.width;
            if (canvas.height !== message.height) canvas.height = message.height;
            const pixels = new Uint8ClampedArray(buffer, byteOffset, byteLength);
            context.putImageData(new ImageData(pixels, message.width, message.height), 0, 0);
            rotationRef.current = message.rotation;
          }
          postToHost({ type: 'frameAck', seq: message.seq });
          return;
        }
      }
    });
    return () => {
      unsubscribe();
      closeDecoder();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let timer: number | undefined;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width = Math.round(entry.contentRect.width * window.devicePixelRatio);
      const height = Math.round(entry.contentRect.height * window.devicePixelRatio);
      window.clearTimeout(timer);
      if (width === 0 || height === 0) return;
      timer = window.setTimeout(
        () => postToHost({ type: 'viewport', width, height }),
        viewportDebounceMs,
      );
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active && canvas) {
      const current = decoderRef.current;
      decoderRef.current = undefined;
      if (current && current.decoder.state !== 'closed') current.decoder.close();
      canvas.width = 0;
      canvas.height = 0;
      gesture.current = undefined;
      setPinchDots(undefined);
    }
  }, [active]);

  // Os pontinhos do pinch aparecem enquanto o Alt está pressionado, mesmo sem mover o mouse.
  useEffect(() => {
    const update = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Alt') return;
      const pointer = lastPointer.current;
      setPinchDots(
        event.type === 'keydown' && pointer && active
          ? pinchDotsAt(canvasRef.current, containerRef.current, pointer.clientX, pointer.clientY)
          : undefined,
      );
    };
    const clear = () => setPinchDots(undefined);
    window.addEventListener('keydown', update);
    window.addEventListener('keyup', update);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', update);
      window.removeEventListener('keyup', update);
      window.removeEventListener('blur', clear);
    };
  }, [active]);

  const sendTouch = (phase: 'down' | 'move' | 'up', point: Point, mirror: boolean) => {
    const natural = toNaturalPoint(point, rotationRef.current);
    postToHost({ type: 'touch', phase, ...natural, mirror });
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!active || event.button !== 0) return;
    const canvas = event.currentTarget;
    const point = toNormalizedPoint(canvas, event.clientX, event.clientY);
    if (!point) return;
    canvas.focus();
    canvas.setPointerCapture(event.pointerId);
    // O modo do gesto é decidido no toque inicial: soltar o Alt no meio não perde o 2º dedo.
    gesture.current = { mirror: event.altKey };
    sendTouch('down', point, event.altKey);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    lastPointer.current = { clientX: event.clientX, clientY: event.clientY };
    const mirror = gesture.current?.mirror ?? event.altKey;
    setPinchDots(
      active && mirror
        ? pinchDotsAt(event.currentTarget, containerRef.current, event.clientX, event.clientY)
        : undefined,
    );
    if (!gesture.current) return;
    const point = toClampedPoint(event.currentTarget, event.clientX, event.clientY);
    if (point) sendTouch('move', point, gesture.current.mirror);
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const current = gesture.current;
    if (!current) return;
    gesture.current = undefined;
    if (!event.altKey) setPinchDots(undefined);
    const point = toClampedPoint(event.currentTarget, event.clientX, event.clientY);
    if (point) sendTouch('up', point, current.mirror);
  };

  const handlePointerLeave = () => {
    lastPointer.current = undefined;
    if (!gesture.current) setPinchDots(undefined);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
    if (!active || event.nativeEvent.isComposing) return;
    // Única combinação que fica com o device: colar o clipboard do host.
    if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      postToHost({ type: 'paste' });
      return;
    }
    // As demais combinações com modificador ficam com o VS Code (Cmd+P, Ctrl+`, etc.).
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const { key } = event;
    if ([...key].length === 1) {
      event.preventDefault();
      postToHost({ type: 'key', key, text: key });
    } else if (specialKeys.has(key)) {
      event.preventDefault();
      postToHost({ type: 'key', key });
    }
  };

  return (
    <div ref={containerRef} className="screen">
      <canvas
        ref={canvasRef}
        className="screen__canvas"
        tabIndex={0}
        aria-label="Device screen"
        width={0}
        height={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
      />
      {pinchDots?.map((dot, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: sempre exatamente dois pontos fixos.
          key={index}
          className="screen__touch-dot"
          style={{ left: dot.x, top: dot.y }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/**
 * O segundo dedo do pinch é o reflexo do ponteiro pelo centro da imagem. Como a imagem fica
 * centralizada no canvas, o centro do canvas serve. Retorna posições relativas ao container.
 */
function pinchDotsAt(
  canvas: HTMLCanvasElement | null,
  container: HTMLDivElement | null,
  clientX: number,
  clientY: number,
): [Point, Point] | undefined {
  if (!canvas || !container || !toNormalizedPoint(canvas, clientX, clientY)) return undefined;
  const canvasRect = canvas.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const centerX = canvasRect.left + canvasRect.width / 2;
  const centerY = canvasRect.top + canvasRect.height / 2;
  return [
    { x: clientX - containerRect.left, y: clientY - containerRect.top },
    { x: 2 * centerX - clientX - containerRect.left, y: 2 * centerY - clientY - containerRect.top },
  ];
}
