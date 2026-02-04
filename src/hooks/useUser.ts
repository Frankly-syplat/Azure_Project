import { useState, useEffect } from 'react';
import { usersApi, type User } from '../api/azure/users.api';
import { generateInitials } from '../utils/generateInitials';

interface UseUserReturn {
  user: User | null;
  userInitials: string;
  isLoading: boolean;
  error: string | null;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await usersApi.getCurrentUser();
        if (response.status === 'success' && response.data) {
          setUser(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to fetch user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const userInitials = user
    ? generateInitials(user.firstName, user.lastName)
    : '';

  return {
    user,
    userInitials,
    isLoading,
    error,
  };
}
