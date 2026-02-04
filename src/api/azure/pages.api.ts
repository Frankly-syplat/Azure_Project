/**
 * Pages API - Will connect to Azure backend
 * Currently returns local JSON data
 */

import { createApiResponse, type ApiResponse } from '../httpClient';
import homeTiles from '../../constants/homeTiles.json';

export interface TileData {
  id: string;
  title: string;
  description: string;
}

export const pagesApi = {
  getHomeTiles: async (): Promise<ApiResponse<TileData[]>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    try {
      return createApiResponse(homeTiles as TileData[]);
    } catch (error) {
      return createApiResponse<TileData[]>(
        null,
        'error',
        'Failed to fetch home tiles'
      );
    }
  },
};
