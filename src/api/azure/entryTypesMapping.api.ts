/**
 * Entry Types Mapping API
 * Mocked Azure layer for Entry Types mapping persistence
 */

import { TaskConnection } from '../../schema/pageSchema';

// In-memory state for mappings (simulates backend persistence)
let savedMappings: TaskConnection[] = [];

/**
 * Save entry type mappings
 * Persists via API (mocked as in-memory state)
 */
export const saveEntryTypeMappings = async (mappings: TaskConnection[]): Promise<void> => {
  savedMappings = [...mappings];
  console.log('[API] Entry Type mappings saved:', mappings);
  return Promise.resolve();
};

/**
 * Get saved entry type mappings
 */
export const getSavedMappings = async (): Promise<TaskConnection[]> => {
  return Promise.resolve([...savedMappings]);
};

/**
 * Clear saved mappings
 */
export const clearMappings = async (): Promise<void> => {
  savedMappings = [];
  return Promise.resolve();
};
