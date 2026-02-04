import React from 'react';
import styles from './Text.module.css';

interface TextProps {
  value: string;
  variant?: 'body' | 'small' | 'muted';
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  value,
  variant = 'body',
  className = '',
}) => {
  return (
    <p className={`${styles.text} ${styles[variant]} ${className}`}>
      {value}
    </p>
  );
};
