import { SYMBOLS, VOCAB_SIZE } from '../../lib/dynamics/types';
import { TASKS } from '../../lib/dynamics/tasks';
import { useAppDispatch, useAppState } from '../../state/AppContext';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { Button } from '../ui/Button';
import styles from './LeftPanel.module.css';

export function LeftPanel() {
  const { taskId, query, controls, showBaseline } = useAppState();
  const dispatch = useAppDispatch();
  const task = TASKS.find((t) => t.id === taskId)!;

  return (
    <div className={styles.panel}>
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Task</span>
        <div className={styles.taskList}>
          {TASKS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={styles.taskButton}
              data-active={t.id === taskId}
              onClick={() => dispatch({ type: 'SET_TASK', taskId: t.id })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Query</span>
        <div className={styles.symbolGrid}>
          {Array.from({ length: VOCAB_SIZE }, (_, i) => (
            <button
              key={i}
              type="button"
              className={styles.symbolButton}
              data-active={i === query}
              onClick={() => dispatch({ type: 'SET_QUERY', query: i })}
            >
              {SYMBOLS[i]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Demonstrations</span>
        <div className={styles.demoList}>
          {task.demonstrationPool.map((demo, i) => (
            <div key={i} className={styles.demoCard} data-included={i < controls.demonstrationCount}>
              <span>
                {SYMBOLS[demo.x]} → {SYMBOLS[demo.y]}
              </span>
              <span>{i < controls.demonstrationCount ? 'shown' : 'not yet shown'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.controlsStack}>
        <span className={styles.sectionTitle}>Controls</span>
        <Slider
          id="control-demos"
          label="Demonstrations"
          value={controls.demonstrationCount}
          min={0}
          max={task.demonstrationPool.length}
          step={1}
          description="How many of the demonstrations above have been shown to the system."
          onChange={(value) => dispatch({ type: 'SET_CONTROL', controls: { demonstrationCount: value } })}
        />
        <Slider
          id="control-plasticity"
          label="Plasticity rate"
          value={controls.plasticity}
          min={0.1}
          max={1}
          step={0.05}
          formatValue={(v) => v.toFixed(2)}
          description="How strongly a single demonstration writes into the synapse matrix."
          onChange={(value) => dispatch({ type: 'SET_CONTROL', controls: { plasticity: value } })}
        />
        <Slider
          id="control-latent"
          label="Latent refinement steps"
          value={controls.latentSteps}
          min={1}
          max={6}
          step={1}
          description="How many times the query's activation is re-read against the synapse matrix before an answer is taken."
          onChange={(value) => dispatch({ type: 'SET_CONTROL', controls: { latentSteps: value } })}
        />
      </div>

      <div className={styles.section}>
        <span className={styles.sectionTitle}>Baseline</span>
        <Toggle label="Show baseline comparison" checked={showBaseline} onChange={() => dispatch({ type: 'TOGGLE_BASELINE' })} />
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => dispatch({ type: 'RESET_TASK' })}>
          Reset to clean state
        </Button>
      </div>
    </div>
  );
}
