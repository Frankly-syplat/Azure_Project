/**
 * Azure Entra ID Authentication Configuration
 * Single-tenant configuration for enterprise authentication
 * 
 * FAIL-FAST: Missing env vars throw immediately - no silent misconfiguration
 */
import { Configuration, LogLevel } from '@azure/msal-browser';

// Environment variables for Azure Entra ID - FAIL-FAST validation
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;

if (!clientId) {
  throw new Error('[AUTH CONFIG] VITE_AZURE_CLIENT_ID is missing.');
}

if (!tenantId) {
  throw new Error('[AUTH CONFIG] VITE_AZURE_TENANT_ID is missing.');
}

/**
 * MSAL Configuration
 * - Single-tenant authority (no 'common' fallback)
 * - Session storage for cache (no persistence across browser sessions)
 * - No custom token lifetime logic
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      piiLoggingEnabled: false,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
        }
      },
    },
  },
};

/**
 * Login request configuration
 * Includes User.Read for fetching user profile from Microsoft Graph
 */
export const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
};

/**
 * Silent request for token acquisition
 * Used for background token refresh - same scopes as login
 */
export const silentRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
};
