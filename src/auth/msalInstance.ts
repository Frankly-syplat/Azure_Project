/**
 * MSAL Instance - Single Instance
 * 
 * CRITICAL: PublicClientApplication must be instantiated EXACTLY ONCE.
 * This module exports the single instance used throughout the application.
 */
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser';
import { msalConfig } from './auth.config';

/**
 * Single MSAL instance for the entire application
 */
export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * Initialize MSAL and set active account if available
 */
export async function initializeMsal(): Promise<void> {
  await msalInstance.initialize();
  
  // Handle redirect response if coming back from redirect flow
  const response = await msalInstance.handleRedirectPromise();
  if (response) {
    msalInstance.setActiveAccount(response.account);
  }
  
  // Set active account from cache if not already set
  const accounts = msalInstance.getAllAccounts();
  if (!msalInstance.getActiveAccount() && accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }
  
  // Listen for sign-in events and set active account
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      msalInstance.setActiveAccount(payload.account);
    }
  });
}
