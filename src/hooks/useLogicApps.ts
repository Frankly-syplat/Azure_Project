import { useState, useEffect, useCallback } from 'react';
import {
  getLogicAppsList,
  getLogicAppDefinition,
  LogicAppItem,
} from '../api/azure/logicApps.api';

interface UseLogicAppsListResult {
  data: LogicAppItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch Logic Apps list
 * UI components receive data via props, not by calling this directly
 */
export function useLogicAppsList(): UseLogicAppsListResult {
  const [data, setData] = useState<LogicAppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getLogicAppsList();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Logic Apps');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchList,
  };
}

interface UseLogicAppDefinitionResult {
  data: unknown;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch Logic App definition (RAW JSON)
 * Only fetches when selectedId is provided
 */
export function useLogicAppDefinition(selectedId: string | null): UseLogicAppDefinitionResult {
  const [data, setData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDefinition = useCallback(async () => {
    if (!selectedId) {
      setData(null);
      return;
    }

    try {
      setIsLoading(true);
      const result = await getLogicAppDefinition(selectedId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load definition');
    } finally {
      setIsLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchDefinition();
  }, [fetchDefinition]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDefinition,
  };
}

interface UseLogicAppsResult {
  // List state
  logicApps: LogicAppItem[];
  listLoading: boolean;
  listError: string | null;
  
  // Selection state
  selectedId: string | null;
  selectLogicApp: (id: string) => void;
  
  // Definition state (RAW JSON)
  definition: unknown;
  definitionLoading: boolean;
  definitionError: string | null;
}

/**
 * Combined hook for Logic Apps page state
 * Orchestrates list, selection, and definition fetching
 * Returns RAW JSON definition for the engine to consume
 */
export function useLogicApps(): UseLogicAppsResult {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const list = useLogicAppsList();
  const definition = useLogicAppDefinition(selectedId);

  const selectLogicApp = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return {
    logicApps: list.data,
    listLoading: list.isLoading,
    listError: list.error,
    selectedId,
    selectLogicApp,
    definition: definition.data,
    definitionLoading: definition.isLoading,
    definitionError: definition.error,
  };
}
