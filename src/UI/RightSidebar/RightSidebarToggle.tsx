import React from 'react';
import { MenuIcon } from '../Icons';
import styles from './RightSidebar.module.css';

interface RightSidebarToggleProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const RightSidebarToggle: React.FC<RightSidebarToggleProps> = ({
  isExpanded,
  onToggle,
}) => {
  return (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={onToggle}
      aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      aria-expanded={isExpanded}
    >
      <MenuIcon size={20} />
    </button>
  );
};
