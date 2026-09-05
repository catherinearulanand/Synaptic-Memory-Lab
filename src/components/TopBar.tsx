import { CLAIM_SHORT } from '../content/claim';
import { useAppDispatch, useAppState } from '../state/AppContext';
import styles from './TopBar.module.css';

export function TopBar() {
  const { mode } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <span className={styles.wordmark}>Synaptic Memory Lab</span>
        <span className={styles.claim}>{CLAIM_SHORT}</span>
      </div>
      <div className={styles.right}>
        {mode !== 'landing' && (
          <div className={styles.modeSwitch} role="group" aria-label="Mode">
            <button
              type="button"
              className={styles.modeButton}
              data-active={mode === 'guided'}
              onClick={() => dispatch({ type: 'SET_MODE', mode: 'guided' })}
            >
              Guided
            </button>
            <button
              type="button"
              className={styles.modeButton}
              data-active={mode === 'lab'}
              onClick={() => dispatch({ type: 'SET_MODE', mode: 'lab' })}
            >
              Sandbox
            </button>
          </div>
        )}
        <a className={styles.sourcesLink} href="#sources">
          Evidence &amp; Sources
        </a>
      </div>
    </header>
  );
}
