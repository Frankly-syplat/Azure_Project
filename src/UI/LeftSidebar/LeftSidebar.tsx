import React from 'react';
import { SidebarIconButton } from './SidebarIconButton';
import {
  MenuIcon,
  PlusIcon,
  HomeIcon,
  DashboardIcon,
  UsersIcon,
  SettingsIcon,
  ChartIcon,
} from '../Icons';
import styles from './LeftSidebar.module.css';

interface SidebarItem {
  id: string;
  icon: string;
  label: string;
}

interface DynamicItem {
  id: string;
  icon: string;
}

interface LeftSidebarProps {
  items: SidebarItem[];
  activeItemId: string;
  dynamicItems: DynamicItem[];
  onItemClick: (id: string) => void;
  onAddClick: () => void;
  onMenuClick?: () => void;
}

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  HomeIcon,
  DashboardIcon,
  UsersIcon,
  SettingsIcon,
  ChartIcon,
};

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  items,
  activeItemId,
  dynamicItems,
  onItemClick,
  onAddClick,
  onMenuClick,
}) => {
  const renderIcon = (iconName: string, size = 20) => {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent size={size} />;
    }
    return <ChartIcon size={size} />;
  };

  return (
    <aside className={styles.leftSidebar}>
      <div className={styles.topSection}>
        <SidebarIconButton ariaLabel="Menu" onClick={onMenuClick}>
          <MenuIcon size={20} />
        </SidebarIconButton>
      </div>

      <div className={styles.mainSection}>
        <SidebarIconButton
          ariaLabel="Add new item"
          variant="primary"
          onClick={onAddClick}
        >
          <PlusIcon size={18} />
        </SidebarIconButton>

        <div className={styles.navStack}>
          {items.map((item) => (
            <SidebarIconButton
              key={item.id}
              ariaLabel={item.label}
              isActive={activeItemId === item.id}
              onClick={() => onItemClick(item.id)}
            >
              {renderIcon(item.icon)}
            </SidebarIconButton>
          ))}
          
          {dynamicItems.map((item) => (
            <SidebarIconButton
              key={item.id}
              ariaLabel={`Dynamic item ${item.id}`}
              isActive={activeItemId === item.id}
              onClick={() => onItemClick(item.id)}
            >
              {renderIcon(item.icon)}
            </SidebarIconButton>
          ))}
        </div>
      </div>
    </aside>
  );
};
