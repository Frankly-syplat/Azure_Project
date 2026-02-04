import React from 'react';
import { usePageResolver } from './pageResolver';
import { renderComponent, ExternalComponentState } from './componentRegistry';
import styles from './PageRenderer.module.css';

interface PageRendererProps {
  pageId: string;
  onAction?: (action: string) => void;
  externalState?: ExternalComponentState;
}

/**
 * PageRenderer Engine
 * Renders pages dynamically from schema definitions.
 * 
 * Responsibilities:
 * - Fetches page schema via pageResolver
 * - Renders components via componentRegistry
 * - Renders page description if present (full-width)
 * - Does NOT contain business logic
 * - Does NOT make API calls directly
 * - Does NOT know about routing
 */
export const PageRenderer: React.FC<PageRendererProps> = ({
  pageId,
  onAction,
  externalState,
}) => {
  const { data: page, isLoading, error } = usePageResolver(pageId);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <span>Loading page...</span>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className={styles.error}>
        <span>{error || 'Page not found'}</span>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageContent}>
        {/* Page header: title + full-width description */}
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{page.title}</h1>
          {page.description && (
            <p className={styles.pageDescription}>{page.description}</p>
          )}
        </header>
        
        {/* Render schema components (skip heading since title is in header) */}
        <div className={styles.componentsSection}>
          {page.components
            .filter(component => component.type !== 'heading')
            .map((component, index) => 
              renderComponent(component, index, onAction, externalState)
            )}
        </div>
      </div>
    </div>
  );
};

export default PageRenderer;
