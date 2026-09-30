import type { StartingStep, TabState } from '../../shared/device';
import { Icon } from './Icon';

const steps: StartingStep[] = ['launching', 'connecting', 'booting'];

const stepLabels: Record<StartingStep, string> = {
  launching: 'Launching device…',
  connecting: 'Connecting to device…',
  booting: 'Waiting for the device to boot…',
};

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

/** O que aparece dentro da moldura enquanto não há imagem do device. */
export function StatusBanner({ tab }: { tab: TabState | undefined }) {
  switch (tab?.kind) {
    case undefined:
      return (
        <div className="status">
          <Icon name="phone" className="status__icon" />
          <p className="status__title">No device running</p>
          <p className="status__hint">Pick a device above and press Start.</p>
        </div>
      );
    case 'starting': {
      const current = steps.indexOf(tab.step);
      return (
        <div className="status" role="status">
          <Spinner />
          <p className="status__title">{stepLabels[tab.step]}</p>
          <ol className="steps" aria-label={`Step ${current + 1} of ${steps.length}`}>
            {steps.map((step, index) => (
              <li
                key={step}
                className={
                  index < current
                    ? 'steps__dot steps__dot--done'
                    : index === current
                      ? 'steps__dot steps__dot--current'
                      : 'steps__dot'
                }
              />
            ))}
          </ol>
        </div>
      );
    }
    case 'stopping':
      return (
        <div className="status" role="status">
          <Spinner />
          <p className="status__title">
            {tab.attached ? 'Detaching from device…' : 'Stopping device…'}
          </p>
          {!tab.attached && tab.platform === 'android' && (
            <p className="status__hint">Saving the Quick Boot snapshot can take ~20s.</p>
          )}
        </div>
      );
    case 'error':
      return (
        <div className="status status--error" role="alert">
          <Icon name="alert" className="status__icon" />
          <p className="status__title">Something went wrong</p>
          <p className="status__hint">{tab.message}</p>
        </div>
      );
    case 'ready':
      return (
        <div className="status" role="status">
          <Spinner />
          <p className="status__title">Waiting for the screen…</p>
        </div>
      );
  }
}
