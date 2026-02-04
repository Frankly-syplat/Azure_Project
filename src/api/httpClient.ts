/**
 * HTTP Client abstraction for future Azure API integration
 * Currently uses local data, will be replaced with actual HTTP calls
 */

export interface ApiResponse<T> {
  data: T | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

export const createApiResponse = <T>(
  data: T | null,
  status: ApiResponse<T>['status'] = 'success',
  error: string | null = null
): ApiResponse<T> => ({
  data,
  status,
  error,
});

// Placeholder for future HTTP client configuration
export const httpClient = {
  baseUrl: '',
  headers: {
    'Content-Type': 'application/json',
  },
};
