import React from 'react';
import { Branding } from './Branding';
import { UserMenu } from '../../components/common';
import { IconButton } from '../IconButton';
import { NotificationIcon, SettingsIcon, HelpIcon, MenuIcon } from '../Icons';
import styles from './TopBar.module.css';

interface TopBarProps {
  onToggleRightSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleRightSidebar }) => {
  return (
    <header className={styles.topBar}>
      <div className={styles.leftSection}>
        <Branding />
      </div>
      
      <div className={styles.rightSection}>
        <div className={styles.actions}>
          <IconButton ariaLabel="Notifications" size="md">
            <NotificationIcon size={20} />
          </IconButton>
          <IconButton ariaLabel="Settings" size="md">
            <SettingsIcon size={20} />
          </IconButton>
          <IconButton ariaLabel="Help" size="md">
            <HelpIcon size={20} />
          </IconButton>
          <IconButton 
            ariaLabel="Toggle right sidebar" 
            size="md"
            onClick={onToggleRightSidebar}
          >
            <MenuIcon size={20} />
          </IconButton>
        </div>
        
        <div className={styles.divider} />
        
        <UserMenu />
      </div>
    </header>
  );
};
