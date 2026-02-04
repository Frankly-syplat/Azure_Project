import { useState, useCallback } from 'react';
import sidebarConfig from '../constants/sidebarConfig.json';

interface SidebarItem {
  id: string;
  icon: string;
  label: string;
}

interface NavItem {
  id: string;
  label: string;
}

interface DynamicItem {
  id: string;
  icon: string;
}

interface UseSidebarReturn {
  // Left Sidebar
  leftSidebarItems: SidebarItem[];
  activeLeftItem: string;
  dynamicItems: DynamicItem[];
  setActiveLeftItem: (id: string) => void;
  addDynamicItem: () => void;
  
  // Right Sidebar
  rightSidebarItems: NavItem[];
  activeRightItem: string;
  isRightSidebarExpanded: boolean;
  setActiveRightItem: (id: string) => void;
  toggleRightSidebar: () => void;
}

const rightNavigation = sidebarConfig.rightSidebarNavigation as Record<string, NavItem[]>;

export function useSidebar(): UseSidebarReturn {
  const [activeLeftItem, setActiveLeftItem] = useState('home');
  const [activeRightItem, setActiveRightItem] = useState('overview');
  const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(true);
  const [dynamicItems, setDynamicItems] = useState<DynamicItem[]>([]);

  const leftSidebarItems = sidebarConfig.leftSidebarItems as SidebarItem[];

  const rightSidebarItems = rightNavigation[activeLeftItem] || rightNavigation.home;

  const handleLeftItemClick = useCallback((id: string) => {
    setActiveLeftItem(id);
    // Reset right sidebar active item when left changes
    const newRightItems = rightNavigation[id] || rightNavigation.home;
    if (newRightItems.length > 0) {
      setActiveRightItem(newRightItems[0].id);
    }
  }, []);

  const addDynamicItem = useCallback(() => {
    const newId = `dynamic-${Date.now()}`;
    setDynamicItems((prev) => [
      ...prev,
      { id: newId, icon: 'ChartIcon' },
    ]);
  }, []);

  const toggleRightSidebar = useCallback(() => {
    setIsRightSidebarExpanded((prev) => !prev);
  }, []);

  return {
    leftSidebarItems,
    activeLeftItem,
    dynamicItems,
    setActiveLeftItem: handleLeftItemClick,
    addDynamicItem,
    rightSidebarItems,
    activeRightItem,
    isRightSidebarExpanded,
    setActiveRightItem,
    toggleRightSidebar,
  };
}
