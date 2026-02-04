import React from 'react';
import styles from './TopBar.module.css';

export const Branding: React.FC = () => {
  return (
    <div className={styles.branding}>
      <span className={styles.logo}>LOGO</span>
    </div>
  );
};
