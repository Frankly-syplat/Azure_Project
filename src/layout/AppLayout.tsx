import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { TopBar } from '../UI/TopBar';
import { LeftSidebar } from '../UI/LeftSidebar';
import { RightSidebar } from '../UI/RightSidebar';
import { ChecklistPanel } from '../UI/RightSidebar/ChecklistPanel';
import { useSidebar } from '../hooks/useSidebar';
import { useMigrationChecklistContext } from '../context/MigrationChecklistContext';
import { usePageResolver } from '../page-engine/pageResolver';
import styles from './layout.module.css';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're on a page route
  const isPageRoute = location.pathname.startsWith('/page/');
  const currentPageId = isPageRoute ? location.pathname.split('/page/')[1] : null;
  const isLogicAppsPage = currentPageId === 'logic-apps';
  
  // Get page schema to check layout
  const { data: pageData } = usePageResolver(currentPageId || '');
  const isMigrationLayout = pageData?.layout === 'migration';
  
  // Checklist for migration layout (consuming from context - single source of truth)
  const { 
    data: checklistData, 
    isLoading: checklistLoading, 
    getTargetPageId,
  } = useMigrationChecklistContext();
  
  const {
    leftSidebarItems,
    activeLeftItem,
    dynamicItems,
    setActiveLeftItem,
    addDynamicItem,
    rightSidebarItems,
    activeRightItem,
    isRightSidebarExpanded,
    setActiveRightItem,
    toggleRightSidebar,
  } = useSidebar();

  const handleChecklistStepClick = (step: { id: string; label: string; status: string; pages: string[] }) => {
    const targetPageId = getTargetPageId(step as any);
    if (targetPageId) {
      navigate(`/page/${targetPageId}`);
    }
  };

  // Handle left sidebar item clicks - navigate to home when HomeIcon is clicked
  const handleLeftItemClick = (id: string) => {
    const clickedItem = leftSidebarItems.find(item => item.id === id);
    
    if (clickedItem?.icon === 'HomeIcon' || id === 'home') {
      navigate('/');
    }
    
    setActiveLeftItem(id);
  };

  return (
    <div className={styles.appLayout}>
      <div className={styles.topBar}>
        <TopBar onToggleRightSidebar={toggleRightSidebar} />
      </div>

      <div className={styles.leftSidebar}>
        <LeftSidebar
          items={leftSidebarItems}
          activeItemId={activeLeftItem}
          dynamicItems={dynamicItems}
          onItemClick={handleLeftItemClick}
          onAddClick={addDynamicItem}
        />
      </div>

      <main className={styles.mainContent}>
        <div className={`${styles.mainWorkspace} ${isLogicAppsPage ? styles.mainWorkspaceFullBleed : ''}`}>
          <Outlet />
        </div>
      </main>

      <div
        className={`${styles.rightSidebar} ${
          !isRightSidebarExpanded ? styles.rightSidebarCollapsed : ''
        }`}
      >
        {isMigrationLayout ? (
          <ChecklistPanel
            steps={checklistData}
            onStepClick={handleChecklistStepClick}
            isLoading={checklistLoading}
          />
        ) : (
          <RightSidebar
            items={rightSidebarItems}
            activeItemId={activeRightItem}
            isExpanded={isRightSidebarExpanded}
            onItemClick={setActiveRightItem}
          />
        )}
      </div>
    </div>
  );
};
