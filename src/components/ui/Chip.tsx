import type { ReactNode } from 'react';
import styles from './Chip.module.css';

interface ChipProps {
  tone?: 'neutral' | 'accent' | 'terracotta' | 'success';
  children: ReactNode;
}

export function Chip({ tone = 'neutral', children }: ChipProps) {
  return (
    <span className={styles.chip} data-tone={tone}>
      {children}
    </span>
  );
}
