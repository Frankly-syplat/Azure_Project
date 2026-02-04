import React from 'react';
import styles from './TileActionButton.module.css';

interface TileActionButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  icon: React.ReactNode;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const TileActionButton: React.FC<TileActionButtonProps> = ({
  onClick,
  ariaLabel,
  icon,
  variant = 'outline',
  size = 'md',
}) => {
  const classNames = [
    styles.tileActionButton,
    styles[variant],
    styles[size],
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};
