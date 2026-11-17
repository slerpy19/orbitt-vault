import React, { useState } from 'react';
import { useAuthStore } from '../store';
import { KeyInput } from './KeyInput';
import { DeviceBoundNotice } from './DeviceBoundNotice';

export const LoginScreen: React.FC = () => {
  const { login, isAuthenticated } = useAuthStore();
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeviceNotice, setShowDeviceNotice] = useState<{ bound: boolean; deviceId?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(key);

    if (result.success) {
      setKey('');
    } else if (result.error?.includes('another device')) {
      setShowDeviceNotice({ bound: true });
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orbitt Vault</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your access key to continue</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSubmit}>
            <KeyInput
              value={key}
              onChange={setKey}
              placeholder="orbitt-xxxxxxxxxxxxxxxxxxxxxxxx"
              disabled={loading}
              autoFocus
            />

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || key.length < 20}
              className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Access Vault'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Don't have a key? Contact the administrator.
            </p>
          </div>
        </div>

        {showDeviceNotice && (
          <DeviceBoundNotice
            onClose={() => setShowDeviceNotice(null)}
          />
        )}
      </div>
    </div>
  );
};