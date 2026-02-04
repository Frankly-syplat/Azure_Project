import React from 'react';
import styles from './RightSidebar.module.css';

interface NavItem {
  id: string;
  label: string;
}

interface RightSidebarProps {
  items: NavItem[];
  activeItemId: string;
  isExpanded: boolean;
  onItemClick: (id: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  items,
  activeItemId,
  isExpanded,
  onItemClick,
}) => {
  if (!isExpanded) {
    return null;
  }

  return (
    <aside className={styles.rightSidebar}>
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.navItem} ${activeItemId === item.id ? styles.active : ''}`}
                onClick={() => onItemClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
