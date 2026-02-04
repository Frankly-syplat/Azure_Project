import { createRoot } from 'react-dom/client';
import { initializeMsal } from './auth';
import App from './App';

// Initialize MSAL before rendering
initializeMsal().then(() => {
  createRoot(document.getElementById('root')!).render(<App />);
}).catch((error) => {
  console.error('Failed to initialize MSAL:', error);
  // Still render the app - auth errors will be handled by ProtectedRoute
  createRoot(document.getElementById('root')!).render(<App />);
});
