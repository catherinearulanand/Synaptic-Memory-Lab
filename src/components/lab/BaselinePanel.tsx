import { SYMBOLS } from '../../lib/dynamics/types';
import type { BaselineTrace } from '../../lib/baseline/tinyAttention';
import { OutputPanel } from './OutputPanel';
import styles from './BaselinePanel.module.css';

interface BaselinePanelProps {
  baseline: BaselineTrace;
}

export function BaselinePanel({ baseline }: BaselinePanelProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Baseline — single-hop attention lookup</span>
        <span className={styles.cacheChip}>cache: {baseline.cacheSize} tokens</span>
      </div>

      {baseline.attentionWeights.length > 0 ? (
        <>
          <div className={styles.bars}>
            {baseline.attentionWeights.map((weight, i) => (
              <div key={i} className={styles.bar} style={{ height: `${Math.max(2, weight * 100)}%` }} />
            ))}
          </div>
          <div className={styles.barLabels}>
            {baseline.cacheLabels.map((symbolIndex, i) => (
              <span key={i}>{SYMBOLS[symbolIndex]}</span>
            ))}
          </div>
        </>
      ) : (
        <p className={styles.note}>No demonstrations yet — the cache is empty.</p>
      )}

      <OutputPanel
        trace={{
          query: baseline.query,
          history: [],
          answerIndex: baseline.answerIndex,
          groundTruthIndex: baseline.groundTruthIndex,
          matches: baseline.matches,
        }}
      />

      <p className={styles.note}>
        Educational re-implementation — a fixed, untrained similarity lookup over demonstrated pairs, not a trained neural
        network. It attends over its entire cache in a single hop and has no mechanism to chain associations.
      </p>
    </div>
  );
}
