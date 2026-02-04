import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  ariaLabel,
  variant = 'default',
  size = 'md',
  isActive = false,
  className = '',
}) => {
  const classNames = [
    styles.iconButton,
    styles[variant],
    styles[size],
    isActive ? styles.active : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
