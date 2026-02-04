import React, { createContext, useContext, ReactNode } from 'react';
import { useMigrationChecklist } from '../hooks/useMigrationChecklist';
import { ChecklistStep } from '../api/azure/migrationChecklist.api';

interface MigrationChecklistContextType {
  data: ChecklistStep[];
  isLoading: boolean;
  error: string | null;
  /** Advance workflow for a specific page (page-aware) */
  advanceStepForPage: (pageId: string) => Promise<void>;
  /** Revert workflow by one step */
  revertStep: () => Promise<void>;
  /** Get the target page ID for a step */
  getTargetPageId: (step: ChecklistStep) => string;
  /** Refetch checklist data */
  refetch: () => Promise<void>;
  
  // DEPRECATED - kept for backwards compatibility
  /** @deprecated Use advanceStepForPage(pageId) instead */
  advanceStep: () => Promise<void>;
  /** @deprecated Use advanceStepForPage(pageId) instead */
  markStepCompleted: (stepId: string) => Promise<void>;
  /** @deprecated Not used in new workflow */
  markStepActive: (stepId: string) => Promise<void>;
  /** @deprecated Not used in new workflow */
  markStepPending: (stepId: string) => Promise<void>;
}

const MigrationChecklistContext = createContext<MigrationChecklistContextType | null>(null);

interface MigrationChecklistProviderProps {
  children: ReactNode;
}

/**
 * MigrationChecklistProvider
 * 
 * Single source of truth for migration checklist state.
 * Must be mounted above both RightSidebar (for display) and PageContainer (for updates).
 * 
 * CRITICAL: Checklist progression is PAGE-AWARE.
 * Only the matching step for the current page is completed on Next click.
 */
export const MigrationChecklistProvider: React.FC<MigrationChecklistProviderProps> = ({ children }) => {
  // Single instance of the checklist hook - this is the ONLY place it should be called
  const checklist = useMigrationChecklist();

  return (
    <MigrationChecklistContext.Provider value={checklist}>
      {children}
    </MigrationChecklistContext.Provider>
  );
};

/**
 * Hook to consume the migration checklist context.
 * Must be used instead of useMigrationChecklist() directly.
 */
export const useMigrationChecklistContext = (): MigrationChecklistContextType => {
  const context = useContext(MigrationChecklistContext);
  
  if (!context) {
    throw new Error(
      'useMigrationChecklistContext must be used within a MigrationChecklistProvider'
    );
  }
  
  return context;
};
