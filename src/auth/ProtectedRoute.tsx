/**
 * ProtectedRoute Component
 * 
 * Enforces authentication before rendering children.
 * - Blocks app until authenticated
 * - Popup primary, redirect fallback
 * - Minimal loading placeholder
 */
import React, { useEffect } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from './auth.config';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Loading placeholder - minimal UI during auth
 */
const AuthLoading: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'hsl(220 20% 98%)',
      fontFamily: 'var(--font-family-sans)',
      color: 'hsl(220 10% 30%)',
    }}
  >
    <span>Authenticating...</span>
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress } = useMsal();
  
  // Trigger login if not authenticated and no interaction in progress
  useEffect(() => {
    const triggerLogin = async () => {
      if (!isAuthenticated && inProgress === InteractionStatus.None) {
        try {
          await instance.loginPopup(loginRequest);
        } catch (popupError) {
          console.warn('Popup login failed, falling back to redirect:', popupError);
          await instance.loginRedirect(loginRequest);
        }
      }
    };
    
    triggerLogin();
  }, [isAuthenticated, inProgress, instance]);
  
  // Show loading while authentication is in progress
  if (inProgress !== InteractionStatus.None) {
    return <AuthLoading />;
  }
  
  // Show loading if not yet authenticated (login will be triggered by effect)
  if (!isAuthenticated) {
    return <AuthLoading />;
  }
  
  // Render children when authenticated
  return <>{children}</>;
};
