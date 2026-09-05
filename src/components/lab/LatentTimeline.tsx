import { SYMBOLS } from '../../lib/dynamics/types';
import type { QueryTrace } from '../../lib/dynamics/types';
import styles from './LatentTimeline.module.css';

interface LatentTimelineProps {
  trace: QueryTrace;
  scrubStep: number | null;
  onScrub: (step: number | null) => void;
}

export function LatentTimeline({ trace, scrubStep, onScrub }: LatentTimelineProps) {
  const lastStep = trace.history.length - 1;
  const current = scrubStep ?? lastStep;

  return (
    <div className={styles.wrap}>
      <p className={styles.caption}>
        Latent refinement — step {current} of {lastStep}
      </p>
      <div className={styles.track} role="group" aria-label="Scrub latent refinement steps">
        {trace.history.map((entry) => (
          <button
            key={entry.step}
            type="button"
            className={styles.step}
            data-current={entry.step === current}
            onClick={() => onScrub(entry.step === lastStep ? null : entry.step)}
          >
            {entry.activeIndex === null ? '·' : SYMBOLS[entry.activeIndex]}
          </button>
        ))}
      </div>
    </div>
  );
}
