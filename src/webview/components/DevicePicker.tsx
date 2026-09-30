import { type KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import type { DeviceDescriptor } from '../../shared/device';
import { Icon, PlatformIcon, platformLabels } from './Icon';

interface DevicePickerProps {
  devices: DeviceDescriptor[];
  selectedId: string;
  onSelect: (deviceId: string) => void;
}

// O popup do <select> nativo é desenhado pelo sistema e ignora o tema; por isso um listbox próprio.
export function DevicePicker({ devices, selectedId, onSelect }: DevicePickerProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const optionId = (index: number) => `${listId}-${index}`;

  // Com as duas plataformas na lista, agrupa para não misturar AVDs e simuladores.
  const platforms = [...new Set(devices.map((device) => device.platform))];
  const ordered = platforms.flatMap((platform) =>
    devices.filter((device) => device.platform === platform),
  );
  const selected = devices.find((device) => device.id === selectedId);

  useEffect(() => {
    if (!open) return;
    // Só dá para focar a lista depois que ela deixa de estar `hidden`.
    listRef.current?.focus();
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnBlur = () => setOpen(false);
    window.addEventListener('pointerdown', close);
    window.addEventListener('blur', closeOnBlur);
    return () => {
      window.removeEventListener('pointerdown', close);
      window.removeEventListener('blur', closeOnBlur);
    };
  }, [open]);

  useEffect(() => {
    if (open)
      listRef.current
        ?.querySelector(`#${CSS.escape(optionId(highlighted))}`)
        ?.scrollIntoView({ block: 'nearest' });
  });

  const openList = () => {
    if (ordered.length === 0) return;
    setHighlighted(
      Math.max(
        0,
        ordered.findIndex((device) => device.id === selectedId),
      ),
    );
    setOpen(true);
  };

  const choose = (index: number) => {
    const device = ordered[index];
    if (device) onSelect(device.id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = ordered.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(highlighted + 1, last),
      ArrowUp: Math.max(highlighted - 1, 0),
      Home: 0,
      End: last,
    };
    const move = moves[event.key];
    if (move !== undefined) {
      event.preventDefault();
      setHighlighted(move);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(highlighted);
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (event.key.length === 1) {
      // Busca pela primeira letra, a partir do item seguinte, como no <select>.
      const letter = event.key.toLowerCase();
      const next = ordered.findIndex(
        (device, index) => index > highlighted && device.name.toLowerCase().startsWith(letter),
      );
      const wrapped =
        next >= 0
          ? next
          : ordered.findIndex((device) => device.name.toLowerCase().startsWith(letter));
      if (wrapped >= 0) setHighlighted(wrapped);
    }
  };

  return (
    <div ref={rootRef} className={open ? 'picker picker--open' : 'picker'}>
      <button
        ref={triggerRef}
        type="button"
        className="picker__trigger"
        aria-label="Device"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={ordered.length === 0}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleTriggerKeyDown}
      >
        {selected ? <PlatformIcon platform={selected.platform} /> : <Icon name="phone" />}
        <span className="picker__value">{selected?.name ?? 'No devices found'}</span>
        {selected?.running && <span className="picker__live" title="Running" />}
        <Icon name="chevron" className="picker__chevron" />
      </button>
      <div
        ref={listRef}
        id={listId}
        className="picker__list"
        role="listbox"
        aria-label="Devices"
        tabIndex={-1}
        hidden={!open}
        aria-activedescendant={open ? optionId(highlighted) : undefined}
        onKeyDown={handleListKeyDown}
      >
        {platforms.map((platform) => (
          // biome-ignore lint/a11y/useSemanticElements: grupo de um listbox ARIA, não de formulário.
          <div key={platform} role="group" aria-label={platformLabels[platform]}>
            {platforms.length > 1 && (
              <div className="picker__group" aria-hidden="true">
                {platformLabels[platform]}
              </div>
            )}
            {ordered.map((device, index) =>
              device.platform === platform ? (
                // biome-ignore lint/a11y/useFocusableInteractive: o foco fica no listbox (aria-activedescendant).
                // biome-ignore lint/a11y/useKeyWithClickEvents: o teclado é tratado no listbox.
                <div
                  key={device.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={device.id === selectedId}
                  className={
                    index === highlighted
                      ? 'picker__option picker__option--highlighted'
                      : 'picker__option'
                  }
                  onPointerMove={() => setHighlighted(index)}
                  onClick={() => choose(index)}
                >
                  <PlatformIcon platform={device.platform} />
                  <span className="picker__name">{device.name}</span>
                  {device.running && <span className="picker__badge">Running</span>}
                  <Icon
                    name="check"
                    className={
                      device.id === selectedId
                        ? 'picker__check'
                        : 'picker__check picker__check--hidden'
                    }
                  />
                </div>
              ) : null,
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
