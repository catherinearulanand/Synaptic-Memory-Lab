import { FAILURE_MODES, OPEN_QUESTIONS } from '../content/limitations';
import styles from './Limitations.module.css';

export function Limitations() {
  return (
    <section className={styles.section} id="limitations">
      <h2 className={styles.title}>Limitations</h2>
      <p className={styles.intro}>
        Two concrete failure modes you can trigger yourself in the laboratory above, and where this toy model stops
        being evidence about anything beyond itself.
      </p>
      <div className={styles.grid}>
        {FAILURE_MODES.map((mode) => (
          <div className={styles.card} key={mode.title}>
            <h3 className={styles.cardTitle}>{mode.title}</h3>
            <p className={styles.cardLabel}>How to trigger it</p>
            <p className={styles.cardText}>{mode.howToTrigger}</p>
            <p className={styles.cardLabel}>What happens</p>
            <p className={styles.cardText}>{mode.whatHappens}</p>
          </div>
        ))}
      </div>
      <p className={styles.openQuestions}>{OPEN_QUESTIONS}</p>
    </section>
  );
}
