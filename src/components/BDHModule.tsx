import { useState } from 'react';
import { BDH_MODULE } from '../content/bdhModule';
import { CITATIONS } from '../content/citations';
import styles from './BDHModule.module.css';

export function BDHModule() {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className={styles.section} id="bdh-module">
      <div className={styles.headerRow} onClick={() => setExpanded((v) => !v)} role="button" tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded((v) => !v); }}
        aria-expanded={expanded}>
        <h2 className={styles.title}>Where this appears in BDH</h2>
        <span>{expanded ? 'Collapse' : 'Expand'}</span>
      </div>
      <p className={styles.intro}>{BDH_MODULE.intro}</p>

      {expanded && (
        <div className={styles.body}>
          <div>
            <h3 className={styles.subTitle}>This lab's toy equations</h3>
            <div className={styles.equationGrid}>
              {BDH_MODULE.toyEquations.map((eq) => (
                <div className={styles.equationCard} key={eq.label}>
                  <div className={styles.equationLabel}>{eq.label}</div>
                  <code className={styles.equationExpr}>{eq.expression}</code>
                  <p className={styles.equationNote}>{eq.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={styles.subTitle}>What you just saw → the BDH mechanism</h3>
            <table className={styles.mappingTable}>
              <thead>
                <tr>
                  <th scope="col">Observed in this lab</th>
                  <th scope="col">BDH concept</th>
                </tr>
              </thead>
              <tbody>
                {BDH_MODULE.mechanismMap.map((row) => (
                  <tr key={row.observed}>
                    <td>{row.observed}</td>
                    <td>{row.concept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className={styles.subTitle}>What is changing when you move a control</h3>
            <p className={styles.whatIsChanging}>{BDH_MODULE.whatIsChanging}</p>
          </div>

          <p className={styles.approximationNote}>{BDH_MODULE.approximationNote}</p>

          <div id="sources">
            <h3 className={styles.subTitle}>Primary sources</h3>
            <ul className={styles.citationList}>
              {CITATIONS.map((c) => (
                <li key={c.label}>
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noreferrer">
                      {c.label}
                    </a>
                  ) : (
                    c.label
                  )}
                  <div className={styles.citationDetail}>{c.detail}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
