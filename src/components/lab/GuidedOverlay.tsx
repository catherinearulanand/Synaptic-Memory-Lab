import { GUIDED_STEPS } from '../../content/walkthrough';
import { GUIDED_STEP_COUNT, useAppDispatch, useAppState } from '../../state/AppContext';
import { Button } from '../ui/Button';
import styles from './GuidedOverlay.module.css';

export function GuidedOverlay() {
  const { guidedStep } = useAppState();
  const dispatch = useAppDispatch();
  const step = GUIDED_STEPS[guidedStep];
  const isLast = guidedStep === GUIDED_STEP_COUNT - 1;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.stepMeta}>
          <span className={styles.stepIndex}>
            {guidedStep + 1} / {GUIDED_STEP_COUNT}
          </span>
          <span className={styles.stepTitle}>{step.title}</span>
        </div>
        <p className={styles.caption}>{step.caption}</p>
        <div className={styles.actions}>
          {guidedStep > 0 && (
            <Button variant="ghost" onClick={() => dispatch({ type: 'SET_GUIDED_STEP', step: guidedStep - 1 })}>
              Back
            </Button>
          )}
          <Button variant="ghost" onClick={() => dispatch({ type: 'SET_MODE', mode: 'lab' })}>
            Skip guidance
          </Button>
          {isLast ? (
            <Button variant="primary" onClick={() => dispatch({ type: 'SET_MODE', mode: 'lab' })}>
              Open laboratory
            </Button>
          ) : (
            <Button variant="primary" onClick={() => dispatch({ type: 'SET_GUIDED_STEP', step: guidedStep + 1 })}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
