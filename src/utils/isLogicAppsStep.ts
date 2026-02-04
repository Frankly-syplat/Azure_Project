/**
 * Utility to check if current step is the Logic Apps step.
 * Uses label/pageId matching, NOT step number.
 */
export const isLogicAppsStep = (
  pageId?: string,
  stepLabel?: string
): boolean => {
  if (!pageId && !stepLabel) return false;

  return (
    pageId?.toLowerCase().includes('logic') ||
    stepLabel?.toLowerCase().includes('logic') ||
    false
  );
};
