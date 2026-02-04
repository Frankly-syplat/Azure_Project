import { useState, useEffect, useCallback } from 'react';
import {
  getChecklist,
  advanceWorkflowForPage,
  revertWorkflow,
  ChecklistStep,
} from '../api/azure/migrationChecklist.api';

interface UseMigrationChecklistResult {
  data: ChecklistStep[];
  isLoading: boolean;
  error: string | null;
  /** Advance workflow for a specific page (page-aware) */
  advanceStepForPage: (pageId: string) => Promise<void>;
  /** Revert workflow by one step (call on "Prev" click if needed) */
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

/**
 * Page ID to Step Index mapping
 * This is the AUTHORITATIVE mapping for checklist progression.
 * Step indices are 0-based.
 */
const PAGE_TO_STEP_INDEX: Record<string, number> = {
  'master-id': 0,      // Step 1
  'entry-types': 1,    // Step 2
  'entry-type-attributes': 2, // Step 3
  'logic-apps': 3,     // Step 4
  // Future pages will be added here
};

/**
 * Hook to fetch and manage Migration Checklist state.
 * 
 * CRITICAL: Checklist completion is PAGE-AWARE.
 * Call advanceStepForPage(pageId) when "Next" is clicked.
 * Only the step matching that pageId will be completed.
 */
export function useMigrationChecklist(): UseMigrationChecklistResult {
  const [data, setData] = useState<ChecklistStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChecklist = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getChecklist();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load checklist');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChecklist();
  }, [fetchChecklist]);

  /**
   * Advance workflow for a specific page (page-aware)
   * This is the PRIMARY way to complete checklist steps.
   * Only completes the step that matches the pageId.
   */
  const advanceStepForPage = useCallback(async (pageId: string) => {
    const stepIndex = PAGE_TO_STEP_INDEX[pageId];
    
    if (stepIndex === undefined) {
      console.warn(`[Checklist] Unknown page "${pageId}" - no step to advance`);
      return;
    }
    
    try {
      const updatedSteps = await advanceWorkflowForPage(pageId, stepIndex);
      setData(updatedSteps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to advance workflow');
    }
  }, []);

  /**
   * Revert workflow by one step
   */
  const revertStep = useCallback(async () => {
    try {
      const updatedSteps = await revertWorkflow();
      setData(updatedSteps);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revert workflow');
    }
  }, []);

  // DEPRECATED methods - kept for backwards compatibility
  const advanceStep = useCallback(async () => {
    console.warn('[DEPRECATED] advanceStep called. Use advanceStepForPage(pageId) instead.');
  }, []);

  const markStepCompleted = useCallback(async (_stepId: string) => {
    console.warn('[DEPRECATED] markStepCompleted called. Use advanceStepForPage(pageId) instead.');
  }, []);

  const markStepActive = useCallback(async (_stepId: string) => {
    console.warn('[DEPRECATED] markStepActive called. This is now handled automatically.');
  }, []);

  const markStepPending = useCallback(async (_stepId: string) => {
    console.warn('[DEPRECATED] markStepPending called. Use revertStep() instead.');
  }, []);

  const getTargetPageId = useCallback((step: ChecklistStep): string => {
    if (step.pages.length === 0) {
      return '';
    }
    return step.pages[0];
  }, []);

  return {
    data,
    isLoading,
    error,
    advanceStepForPage,
    revertStep,
    getTargetPageId,
    refetch: fetchChecklist,
    // Deprecated
    advanceStep,
    markStepCompleted,
    markStepActive,
    markStepPending,
  };
}
