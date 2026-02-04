import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import styles from './UserProfileMenu.module.css';

/**
 * UserProfileMenu
 * 
 * Displays user profile chip with popup menu showing full name and logout.
 * All auth data is read from MSAL at runtime - never stored.
 */
export const UserProfileMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Generate initials from user name
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        type="button"
        className={styles.profileChip}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className={styles.initials}>{initials}</span>
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu">
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'User'}</span>
            <span className={styles.userEmail}>{user?.email || ''}</span>
          </div>
          <div className={styles.divider} />
          <button
            type="button"
            className={styles.menuItem}
            onClick={handleLogout}
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
