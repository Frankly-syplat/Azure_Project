// Migration Checklist API
// Mocked Azure layer for Checklist state with 25 steps

export type ChecklistStatus = 'pending' | 'active' | 'completed';

export type ChecklistStep = {
  id: string;
  label: string;
  status: ChecklistStatus;
  pages: string[];
};

/**
 * Generate 25 migration steps
 * Steps 1-2 have specific pages, steps 3-25 are future steps
 */
const generateInitialChecklist = (): ChecklistStep[] => {
  const steps: ChecklistStep[] = [
    { id: 'step-1', label: 'Master ID Store', status: 'pending', pages: ['master-id'] },
    { id: 'step-2', label: 'Entry Types', status: 'pending', pages: ['entry-types'] },
    { id: 'step-3', label: 'Entry Type Attributes', status: 'pending', pages: ['entry-type-attributes'] },
    { id: 'step-4', label: 'Logic Apps', status: 'pending', pages: ['logic-apps'] },
  ];
  
  // Add steps 4-25
  const stepLabels = [
    'Field Mapping',
    'Relationship Links',
    'Custom Fields',
    'User Permissions',
    'Data Transformation',
    'Error Handling',
    'Batch Configuration',
    'Schedule Setup',
    'Notification Rules',
    'Rollback Strategy',
    'Testing Environment',
    'Dry Run Execution',
    'Performance Check',
    'Security Audit',
    'Compliance Review',
    'Stakeholder Approval',
    'Production Prep',
    'Migration Execution',
    'Data Verification',
    'Post-Migration Audit',
    'Documentation Update',
    'Training Materials',
  ];
  
  stepLabels.forEach((label, index) => {
    steps.push({
      id: `step-${index + 5}`,
      label,
      status: 'pending',
      pages: [`step-${index + 5}`], // Future pages
    });
  });
  
  return steps;
};

// Mutable state for checklist (simulates backend state)
let checklistState: ChecklistStep[] = generateInitialChecklist();

// Track completion progress (how many "Next" clicks have occurred)
let completedStepCount = 0;

/**
 * Get the current checklist state
 */
export const getChecklist = async (): Promise<ChecklistStep[]> => {
  return Promise.resolve([...checklistState]);
};

/**
 * Advance workflow for a specific page (page-aware)
 * Only completes the step that matches the pageId/stepIndex.
 * 
 * @param pageId - The page ID that triggered the Next click
 * @param stepIndex - The 0-based index of the step to complete
 * @returns Updated checklist state
 */
export const advanceWorkflowForPage = async (
  pageId: string,
  stepIndex: number
): Promise<ChecklistStep[]> => {
  // Only advance if this step hasn't been completed yet
  if (stepIndex >= completedStepCount) {
    // Mark all steps up to and including this one as completed
    completedStepCount = stepIndex + 1;
    
    // Update all steps based on completion count
    checklistState = checklistState.map((step, index) => {
      if (index < completedStepCount) {
        return { ...step, status: 'completed' as ChecklistStatus };
      } else if (index === completedStepCount) {
        return { ...step, status: 'active' as ChecklistStatus };
      } else {
        return { ...step, status: 'pending' as ChecklistStatus };
      }
    });
    console.log(`[Workflow] Completed step ${stepIndex + 1} (${pageId})`);
  } else {
    console.log(`[Workflow] Step ${stepIndex + 1} (${pageId}) already completed`);
  }
  
  return Promise.resolve([...checklistState]);
};

/**
 * @deprecated Use advanceWorkflowForPage instead
 */
export const advanceWorkflow = async (): Promise<ChecklistStep[]> => {
  console.warn('[DEPRECATED] advanceWorkflow called. Use advanceWorkflowForPage instead.');
  return Promise.resolve([...checklistState]);
};

/**
 * Get the current workflow progress
 */
export const getWorkflowProgress = async (): Promise<number> => {
  return Promise.resolve(completedStepCount);
};

/**
 * Go back one step in the workflow
 */
export const revertWorkflow = async (): Promise<ChecklistStep[]> => {
  if (completedStepCount > 0) {
    completedStepCount--;
    
    // Update all steps based on completion count
    checklistState = checklistState.map((step, index) => {
      const stepNumber = index + 1;
      
      if (stepNumber <= completedStepCount) {
        return { ...step, status: 'completed' as ChecklistStatus };
      } else if (stepNumber === completedStepCount + 1) {
        return { ...step, status: 'active' as ChecklistStatus };
      } else {
        return { ...step, status: 'pending' as ChecklistStatus };
      }
    });
  }
  
  console.log(`[Workflow] Reverted to step ${completedStepCount + 1}`);
  return Promise.resolve([...checklistState]);
};

// DEPRECATED: These are kept for backwards compatibility but should not be used
// Completion is now driven ONLY by advanceWorkflow()

/**
 * @deprecated Use advanceWorkflow() instead
 */
export const updateChecklistStepStatus = async (
  id: string,
  status: ChecklistStatus
): Promise<ChecklistStep[]> => {
  console.warn('[DEPRECATED] updateChecklistStepStatus called. Use advanceWorkflow() instead.');
  checklistState = checklistState.map((step) =>
    step.id === id ? { ...step, status } : step
  );
  return Promise.resolve([...checklistState]);
};

/**
 * Reset checklist to initial state (for testing/demo)
 */
export const resetChecklist = async (): Promise<ChecklistStep[]> => {
  checklistState = generateInitialChecklist();
  completedStepCount = 0;
  return Promise.resolve([...checklistState]);
};
