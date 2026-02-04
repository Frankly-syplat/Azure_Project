import React from 'react';
import styles from './LeftSidebar.module.css';

interface SidebarIconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  isActive?: boolean;
  variant?: 'default' | 'primary';
}

export const SidebarIconButton: React.FC<SidebarIconButtonProps> = ({
  children,
  onClick,
  ariaLabel,
  isActive = false,
  variant = 'default',
}) => {
  const classNames = [
    styles.sidebarIconButton,
    styles[variant],
    isActive ? styles.active : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={isActive}
    >
      {children}
    </button>
  );
};
