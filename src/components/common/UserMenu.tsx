import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import styles from './UserMenu.module.css';

/**
 * UserMenu
 * 
 * Single, unified user menu component for the TopBar.
 * Reads user data from MSAL at runtime - never stored.
 * 
 * Responsibilities:
 * - Display user initials chip
 * - Show dropdown with full name and logout on click
 * - Handle MSAL logout flow
 */
export const UserMenu: React.FC = () => {
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
        className={styles.chip}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className={styles.initials}>{initials}</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'User'}</span>
            <span className={styles.userEmail}>{user?.email || ''}</span>
          </div>
          <div className={styles.divider} />
          <button
            type="button"
            className={styles.logoutButton}
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
