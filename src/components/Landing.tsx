import { CLAIM } from '../content/claim';
import { useAppDispatch } from '../state/AppContext';
import { Button } from './ui/Button';
import styles from './Landing.module.css';

function Motif() {
  return (
    <svg className={styles.motif} viewBox="0 0 120 120" role="presentation" aria-hidden="true">
      <g fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.8">
        <line x1="20" y1="30" x2="60" y2="55" />
        <line x1="60" y1="55" x2="100" y2="35" />
        <line x1="60" y1="55" x2="45" y2="95" />
        <line x1="60" y1="55" x2="90" y2="90" />
        <line x1="20" y1="30" x2="45" y2="95" />
      </g>
      <g fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5">
        <circle cx="20" cy="30" r="6" />
        <circle cx="100" cy="35" r="6" />
        <circle cx="60" cy="55" r="7" />
        <circle cx="45" cy="95" r="6" />
        <circle cx="90" cy="90" r="6" />
      </g>
    </svg>
  );
}

export function Landing() {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.wrap}>
      <Motif />
      <h1 className={styles.title}>Synaptic Memory Lab</h1>
      <blockquote className={styles.pullQuote}>{CLAIM}</blockquote>
      <p className={styles.body}>
        Add a handful of demonstrations to a small, fixed-size synaptic state, then watch it answer a query through
        repeated latent refinement — compared, side by side, against a baseline whose memory grows with every example.
        Roughly ninety seconds to the point.
      </p>
      <div className={styles.actions}>
        <Button variant="primary" onClick={() => dispatch({ type: 'SET_MODE', mode: 'guided' })}>
          Begin the walkthrough
        </Button>
        <Button variant="secondary" onClick={() => dispatch({ type: 'SET_MODE', mode: 'lab' })}>
          Jump to laboratory
        </Button>
      </div>
      <p className={styles.footer}>
        DataForge 2026 · Pathway Track. Reference architecture: Dragon Hatchling (BDH). See Evidence &amp; Sources below.
      </p>
    </div>
  );
}
