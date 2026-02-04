import { useState, useEffect, useCallback } from 'react';
import { getEntryTypesByOcisid, EntryTypeItem } from '../api/azure/entryTypes.api';

interface UseEntryTypesOptions {
  ocisid?: number; // Filter by ocisid (1, 6, or 9)
}

interface UseEntryTypesResult {
  left: string[];
  right: string[];
  isLoading: boolean;
  error: string | null;
  selectedLeft: string | null;
  selectedRight: string | null;
  selectLeft: (item: string | null) => void;
  selectRight: (item: string | null) => void;
  clearSelection: () => void;
}

/**
 * Hook to fetch and manage Entry Types data + selection state.
 * Fetches from API layer filtered by ocisid, manages dual selection state.
 */
export function useEntryTypes(options: UseEntryTypesOptions = {}): UseEntryTypesResult {
  const { ocisid = 1 } = options;
  
  const [left, setLeft] = useState<string[]>([]);
  const [right, setRight] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntryTypes = async () => {
      try {
        setIsLoading(true);
        console.log("[useEntryTypes] Fetching for ocisid:", ocisid);
        
        const items: EntryTypeItem[] = await getEntryTypesByOcisid(ocisid);
        console.log("[useEntryTypes] Fetched items:", items.length);
        
        const ocnames = items.map(item => item.ocname);
        const targetNumbers = ocnames.map((_, index) => String(index + 1));
        
        setLeft(ocnames);
        setRight(targetNumbers);
        setError(null);
      } catch (err) {
        console.error("[useEntryTypes] Error:", err);
        setError(err instanceof Error ? err.message : 'Failed to load entry types');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntryTypes();
  }, [ocisid]);

  const selectLeft = useCallback((item: string | null) => {
    setSelectedLeft(item);
  }, []);

  const selectRight = useCallback((item: string | null) => {
    setSelectedRight(item);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLeft(null);
    setSelectedRight(null);
  }, []);

  return {
    left,
    right,
    isLoading,
    error,
    selectedLeft,
    selectedRight,
    selectLeft,
    selectRight,
    clearSelection,
  };
}
