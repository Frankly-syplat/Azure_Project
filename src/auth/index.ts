/**
 * Authentication Module Exports
 * 
 * Centralized exports for auth functionality.
 */
export { msalConfig, loginRequest, silentRequest } from './auth.config';
export { msalInstance, initializeMsal } from './msalInstance';
export { AuthProvider } from './AuthProvider';
export { ProtectedRoute } from './ProtectedRoute';
export { useAuth } from './useAuth';
export type { AuthUser, UseAuthResult } from './useAuth';
export { getAccessToken } from './getAccessToken';
