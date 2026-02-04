import { useState, useEffect } from 'react';
import { pagesApi, type TileData } from '../api/azure/pages.api';
import type { ApiResponse } from '../api/httpClient';

interface UseHomeReturn {
  tiles: TileData[];
  status: ApiResponse<TileData[]>['status'];
  error: string | null;
}

export function useHome(): UseHomeReturn {
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [status, setStatus] = useState<ApiResponse<TileData[]>['status']>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTiles = async () => {
      setStatus('loading');
      try {
        const response = await pagesApi.getHomeTiles();
        if (response.status === 'success' && response.data) {
          setTiles(response.data);
          setStatus('success');
        } else {
          setError(response.error);
          setStatus('error');
        }
      } catch (err) {
        setError('Failed to fetch tiles');
        setStatus('error');
      }
    };

    fetchTiles();
  }, []);

  return {
    tiles,
    status,
    error,
  };
}
