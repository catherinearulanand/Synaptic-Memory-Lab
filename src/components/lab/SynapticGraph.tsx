import { useState } from 'react';
import { SYMBOLS, VOCAB_SIZE } from '../../lib/dynamics/types';
import type { SynapseMatrix } from '../../lib/dynamics/types';
import { Button } from '../ui/Button';
import styles from './SynapticGraph.module.css';

interface SynapticGraphProps {
  state: SynapseMatrix;
  activation: number[];
  query: number;
}

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = 150;
const NODE_R = 22;

function nodePosition(index: number) {
  const angle = (index / VOCAB_SIZE) * 2 * Math.PI - Math.PI / 2;
  return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
}

function edgePath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const startX = from.x + (dx / dist) * NODE_R;
  const startY = from.y + (dy / dist) * NODE_R;
  const endX = to.x - (dx / dist) * NODE_R;
  const endY = to.y - (dy / dist) * NODE_R;
  return { startX, startY, endX, endY };
}

export function SynapticGraph({ state, activation, query }: SynapticGraphProps) {
  const [showTable, setShowTable] = useState(false);
  const positions = Array.from({ length: VOCAB_SIZE }, (_, i) => nodePosition(i));
  const maxWeight = Math.max(1e-6, ...state.flat());

  return (
    <div className={styles.wrap}>
      <div className={styles.svgWrap}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Synaptic graph of the eight-symbol vocabulary">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>
          {state.map((row, i) =>
            row.map((weight, j) => {
              if (weight <= 0.02 || i === j) return null;
              const { startX, startY, endX, endY } = edgePath(positions[i], positions[j]);
              const strength = Math.min(1, weight / maxWeight);
              return (
                <line
                  key={`${i}-${j}`}
                  className={styles.edge}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  strokeWidth={1 + strength * 4}
                  opacity={0.25 + strength * 0.65}
                  markerEnd="url(#arrow)"
                />
              );
            }),
          )}
          {positions.map((pos, i) => {
            const activationValue = activation[i] ?? 0;
            const isQuery = i === query;
            const isActive = activationValue > 0.02;
            return (
              <g key={i} className={styles.node} style={{ transform: isActive ? 'scale(1.06)' : 'scale(1)' }}>
                {isActive && (
                  <circle
                    className={styles.halo}
                    cx={pos.x}
                    cy={pos.y}
                    r={NODE_R + 10}
                    opacity={0.15 + activationValue * 0.35}
                  />
                )}
                <circle
                  className={styles.nodeCircle}
                  data-role={isQuery ? 'query' : isActive ? 'active' : undefined}
                  cx={pos.x}
                  cy={pos.y}
                  r={NODE_R}
                >
                  <title>
                    {SYMBOLS[i]} — {isQuery ? 'query symbol' : isActive ? 'currently active' : 'at rest'}
                  </title>
                </circle>
                <text className={styles.nodeLabel} x={pos.x} y={pos.y + 1}>
                  {SYMBOLS[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} /> edge thickness &amp; opacity — synapse strength
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} /> glow — active in the current latent step
        </span>
        <span className={styles.legendItem}>sand ring — query symbol</span>
      </div>

      <Button variant="ghost" className={styles.tableToggle} onClick={() => setShowTable((v) => !v)}>
        {showTable ? 'Hide data table' : 'Show data table'}
      </Button>

      {showTable && (
        <table className={styles.table}>
          <caption>Synapse weights, from (row) to (column). Data alternative to the graph above.</caption>
          <thead>
            <tr>
              <th scope="col">from \ to</th>
              {SYMBOLS.map((s) => (
                <th scope="col" key={s}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.map((row, i) => (
              <tr key={i}>
                <th scope="row">{SYMBOLS[i]}</th>
                {row.map((weight, j) => (
                  <td key={j}>{weight > 0.005 ? weight.toFixed(2) : '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
