/**
 * Users API - Will connect to Azure backend
 * Currently returns hardcoded user data
 */

import { createApiResponse, type ApiResponse } from '../httpClient';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const currentUser: User = {
  id: '1',
  firstName: 'Maya',
  lastName: 'Collins',
  email: 'maya.collins@example.com',
};

export const usersApi = {
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return createApiResponse(currentUser);
  },
};
