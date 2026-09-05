import styles from './Slider.module.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  formatValue?: (value: number) => string;
  description: string;
  onChange: (value: number) => void;
  id: string;
}

export function Slider({ label, value, min, max, step, formatValue, description, onChange, id }: SliderProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
        <span className={styles.value}>{formatValue ? formatValue(value) : value}</span>
      </div>
      <input
        id={id}
        className={styles.input}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <p className={styles.description}>{description}</p>
    </div>
  );
}
