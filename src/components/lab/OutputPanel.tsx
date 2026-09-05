import { SYMBOLS } from '../../lib/dynamics/types';
import type { QueryTrace } from '../../lib/dynamics/types';
import { Chip } from '../ui/Chip';
import styles from './OutputPanel.module.css';

interface OutputPanelProps {
  trace: QueryTrace;
  precomputed?: boolean;
}

function symbolLabel(index: number | null) {
  return index === null ? 'no confident association' : SYMBOLS[index];
}

export function OutputPanel({ trace, precomputed }: OutputPanelProps) {
  const tone = trace.answerIndex === null ? undefined : trace.matches ? 'match' : 'mismatch';

  return (
    <div className={styles.wrap}>
      {precomputed && <Chip tone="accent">This run used a precomputed trajectory</Chip>}
      <div className={styles.row} data-tone={tone}>
        <span className={styles.rowLabel}>Model answer</span>
        <span className={styles.rowValue}>{symbolLabel(trace.answerIndex)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowLabel}>Ground truth</span>
        <span className={styles.rowValue}>{symbolLabel(trace.groundTruthIndex)}</span>
      </div>
      <p className={styles.statusLine} data-tone={tone}>
        {trace.answerIndex === null
          ? 'No confident association — the required synapse was never demonstrated.'
          : trace.matches
            ? 'Synaptic state updated — answer matches ground truth.'
            : 'Synaptic state updated — answer does not match ground truth.'}
      </p>
    </div>
  );
}
