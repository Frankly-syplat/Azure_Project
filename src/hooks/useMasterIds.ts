import { useState, useEffect, useCallback } from 'react';
import { getMasterIds, MasterIdOption } from '../api/azure/masterIds.api';

interface UseMasterIdsResult {
  data: MasterIdOption[];
  isLoading: boolean;
  error: string | null;
  selectedId: string;
  selectedOcisid: number; // The ocisid corresponding to the selected Master ID
  selectId: (id: string) => void;
}

/**
 * Hook to fetch and manage Master ID selection.
 * Fetches from API layer, manages selection state including ocisid.
 */
export function useMasterIds(): UseMasterIdsResult {
  const [data, setData] = useState<MasterIdOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedOcisid, setSelectedOcisid] = useState<number>(1); // Default to 1

  useEffect(() => {
    const fetchMasterIds = async () => {
      try {
        setIsLoading(true);
        const result = await getMasterIds();
        console.log("[useMasterIds] Fetched data:", result);
        setData(result);
        setError(null);
      } catch (err) {
        console.error("[useMasterIds] Error:", err);
        setError(err instanceof Error ? err.message : 'Failed to load master IDs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMasterIds();
  }, []);

  const selectId = useCallback((id: string) => {
    setSelectedId(id);
    // Find the ocisid for this Master ID
    const option = data.find(opt => opt.id === id);
    const ocisid = option?.ocisid ?? 1; // Default to 1 if not found
    setSelectedOcisid(ocisid);
    console.log("[useMasterIds] Selected:", id, "with ocisid:", ocisid);
  }, [data]);

  return {
    data,
    isLoading,
    error,
    selectedId,
    selectedOcisid,
    selectId,
  };
}
