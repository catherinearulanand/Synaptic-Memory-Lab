import { useEffect } from 'react';
import { useAppDispatch, useAppState } from '../../state/AppContext';
import { useLabComputation } from '../../state/useLabComputation';
import { GUIDED_STEPS } from '../../content/walkthrough';
import { guidedWalkthroughFixture } from '../../lib/trajectory/loadFixture';
import { Card } from '../ui/Card';
import { LeftPanel } from './LeftPanel';
import { SynapticGraph } from './SynapticGraph';
import { LatentTimeline } from './LatentTimeline';
import { OutputPanel } from './OutputPanel';
import { BaselinePanel } from './BaselinePanel';
import { GuidedOverlay } from './GuidedOverlay';
import { BDHModule } from '../BDHModule';
import { Limitations } from '../Limitations';
import styles from './Laboratory.module.css';

export function Laboratory() {
  const { mode, guidedStep, scrubStep, showBaseline } = useAppState();
  const dispatch = useAppDispatch();
  const live = useLabComputation();

  useEffect(() => {
    if (mode !== 'guided') return;
    const step = GUIDED_STEPS[guidedStep];
    dispatch({ type: 'APPLY_GUIDED_STEP', controls: step.controls, showBaseline: step.showBaseline });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, guidedStep]);

  const usesFixture = mode === 'guided' && guidedStep === GUIDED_STEPS.length - 1;

  const state = usesFixture ? guidedWalkthroughFixture.state : live.state;
  const trace = usesFixture ? guidedWalkthroughFixture.traceTwoStep : live.trace;
  const baseline = usesFixture ? guidedWalkthroughFixture.baseline : live.baseline;

  const displayStep = scrubStep ?? trace.history.length - 1;
  const activation = trace.history[displayStep]?.activation ?? trace.history[trace.history.length - 1].activation;

  return (
    <>
      <div className={styles.grid}>
        <div className={styles.leftColumn}>
          <Card>
            <LeftPanel />
          </Card>
        </div>

        <div className={styles.canvasColumn}>
          <Card>
            <SynapticGraph state={state} activation={activation} query={live.trace.query} />
          </Card>

          <Card>
            <LatentTimeline trace={trace} scrubStep={scrubStep} onScrub={(step) => dispatch({ type: 'SET_SCRUB', step })} />
          </Card>

          <div className={styles.canvasRow}>
            <Card>
              <OutputPanel trace={trace} precomputed={usesFixture} />
            </Card>
            {showBaseline && (
              <Card>
                <BaselinePanel baseline={baseline} />
              </Card>
            )}
          </div>
        </div>
      </div>

      <BDHModule />
      <Limitations />

      {mode === 'guided' && <GuidedOverlay />}
    </>
  );
}
