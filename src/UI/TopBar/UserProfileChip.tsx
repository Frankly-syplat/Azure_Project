import React from 'react';
import styles from './TopBar.module.css';

interface UserProfileChipProps {
  initials: string;
  onClick?: () => void;
}

export const UserProfileChip: React.FC<UserProfileChipProps> = ({ initials, onClick }) => {
  return (
    <button
      type="button"
      className={styles.userProfileChip}
      onClick={onClick}
      aria-label="User profile menu"
    >
      <span className={styles.initials}>{initials}</span>
    </button>
  );
};
