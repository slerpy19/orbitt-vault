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
import LaunchScreen from './LaunchScreen';

function AuthGate() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <React.StrictMode>
      <App />
      <LaunchScreen />
    </React.StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<AuthGate />);