/**
 * Files API - Will connect to Azure backend
 * Placeholder for file operations
 */

import { createApiResponse, type ApiResponse } from '../httpClient';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  createdAt: string;
}

export const filesApi = {
  listFiles: async (): Promise<ApiResponse<FileMetadata[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return createApiResponse<FileMetadata[]>([]);
  },
};
