/**
 * AuthProvider Component
 * 
 * Wraps the application with MSAL provider.
 * Must be mounted at the root level, wrapping the persistent layout.
 */
import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './msalInstance';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider
 * Provides MSAL context to the entire application.
 * Uses the single msalInstance - no duplicate instances.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <MsalProvider instance={msalInstance}>
      {children}
    </MsalProvider>
  );
};
