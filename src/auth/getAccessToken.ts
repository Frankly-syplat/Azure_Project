/**
 * Get Access Token
 * 
 * Utility to acquire access tokens for API calls.
 * Uses silent acquisition with redirect fallback.
 */
import { msalInstance } from './msalInstance';
import { silentRequest } from './auth.config';

/**
 * Acquire access token silently, with redirect fallback
 * @param scopes - Optional custom scopes (defaults to silentRequest.scopes)
 * @returns Access token string
 */
export async function getAccessToken(scopes?: string[]): Promise<string> {
  const account = msalInstance.getActiveAccount();
  
  if (!account) {
    throw new Error('No active account. User must be authenticated.');
  }
  
  const request = {
    ...silentRequest,
    scopes: scopes || silentRequest.scopes,
    account,
  };
  
  try {
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (silentError) {
    console.warn('Silent token acquisition failed, redirecting:', silentError);
    // Fallback to redirect for token acquisition
    await msalInstance.acquireTokenRedirect(request);
    // This line won't be reached as redirect navigates away
    throw new Error('Redirecting for authentication');
  }
}
