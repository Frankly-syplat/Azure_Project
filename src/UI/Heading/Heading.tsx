import React from 'react';
import styles from './Heading.module.css';

interface HeadingProps {
  value: string;
  level?: 1 | 2 | 3 | 4;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  value,
  level = 1,
  className = '',
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag className={`${styles.heading} ${styles[`level${level}`]} ${className}`}>
      {value}
    </Tag>
  );
};
