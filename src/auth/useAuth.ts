/**
 * useAuth Hook
 * 
 * Exposes authentication state and methods from MSAL context.
 * This is the ONLY place auth state should be consumed from.
 * 
 * Exposes ONLY:
 * - isAuthenticated
 * - user (safe claims only)
 * - login()
 * - logout()
 */
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useCallback, useMemo } from 'react';
import { loginRequest } from './auth.config';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
}

export interface UseAuthResult {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

/**
 * Authentication hook
 * Provides auth state and methods for the application
 */
export function useAuth(): UseAuthResult {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  
  // Derive user from active account (safe claims only)
  const user = useMemo((): AuthUser | null => {
    const account = instance.getActiveAccount() || accounts[0];
    if (!account) return null;
    
    return {
      id: account.localAccountId || account.homeAccountId,
      name: account.name || '',
      email: account.username || '',
      username: account.username || '',
    };
  }, [instance, accounts]);
  
  // Login with popup (primary), redirect fallback
  const login = useCallback(async (): Promise<void> => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (popupError) {
      console.warn('Popup login failed, falling back to redirect:', popupError);
      // Fallback to redirect if popup fails (blocked by browser, etc.)
      await instance.loginRedirect(loginRequest);
    }
  }, [instance]);
  
  // Logout - clear session using redirect (more reliable than popup)
  const logout = useCallback(async (): Promise<void> => {
    instance.setActiveAccount(null);
    await instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  }, [instance]);
  
  return {
    isAuthenticated,
    isLoading: inProgress !== 'none',
    user,
    login,
    logout,
  };
}
