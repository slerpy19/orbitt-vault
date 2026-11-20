import React from 'react';
import { createRoot } from 'react-dom/client';
import { useAuthStore } from './auth/store';
import { LoginScreen } from './auth';
import './styles.css';
import './styles-extra.css';
import './styles-reference.css';
import './styles-mobile.css';
import './styles-screenshot-reference.css';
import './styles-flows.css';
import App from './App';
import './pwa';

function AuthGate() {
  const { isAuthenticated, checkAuth, authChecked } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<AuthGate />);