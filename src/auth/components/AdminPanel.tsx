import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { getAdminPassword } from '../types';

export const AdminPanel: React.FC = () => {
  const { isAdmin, adminKeys, createKey, createKeys, revokeKey, listKeys, logout } = useAuthStore();
  const [password, setPassword] = useState('');
  const [showAuth, setShowAuth] = useState(!isAdmin);
  const [authError, setAuthError] = useState('');
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [batchCount, setBatchCount] = useState(5);
  const [batchPrefix, setBatchPrefix] = useState('user');
  const [creating, setCreating] = useState(false);
  const [keys, setKeys] = useState<ReturnType<typeof listKeys>>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      refreshKeys();
    }
  }, [isAdmin]);

  const refreshKeys = () => {
    setKeys(listKeys());
  };

  const handleAuth = () => {
    if (password === getAdminPassword()) {
      useAuthStore.setState({ isAdmin: true });
      setShowAuth(false);
      setPassword('');
      setAuthError('');
      refreshKeys();
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleCreateKey = async () => {
    setCreating(true);
    await createKey(newKeyLabel || undefined);
    setNewKeyLabel('');
    refreshKeys();
    setCreating(false);
  };

  const handleCreateBatch = async () => {
    setCreating(true);
    await createKeys(batchCount, batchPrefix || undefined);
    refreshKeys();
    setCreating(false);
  };

  const handleRevoke = async (key: string) => {
    if (window.confirm('Revoke this key? This cannot be undone.')) {
      await revokeKey(key);
      refreshKeys();
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleDateString();

  const formatStatus = (key: ReturnType<typeof listKeys>[0]) => {
    if (!key.isActive) return { label: 'Revoked', class: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' };
    if (key.boundDeviceId) return { label: 'Active', class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' };
    return { label: 'Unused', class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' };
  };

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Access</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Enter password to manage keys</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            {authError && (
              <p className="text-red-500 text-sm text-center">{authError}</p>
            )}
            <button
              onClick={handleAuth}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Access Admin Panel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          </div>
          <button
            onClick={() => useAuthStore.setState({ isAdmin: false })}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium"
          >
            Exit Admin
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Single Key</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newKeyLabel}
                  onChange={(e) => setNewKeyLabel(e.target.value)}
                  placeholder="Optional label (e.g., 'john-phone')"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleCreateKey}
                  disabled={creating}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
                >
                  {creating ? 'Creating...' : 'Generate Key'}
                </button>
              </div>
            </div>

            <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Batch Create Keys</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Count</label>
                  <input
                    type="number"
                    value={batchCount}
                    onChange={(e) => setBatchCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    min={1}
                    max={100}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label Prefix</label>
                  <input
                    type="text"
                    value={batchPrefix}
                    onChange={(e) => setBatchPrefix(e.target.value)}
                    placeholder="e.g., 'team', 'beta'"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={handleCreateBatch}
                  disabled={creating}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {creating ? 'Creating...' : `Generate ${batchCount} Keys`}
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Keys ({keys.length})</h2>
                <button
                  onClick={refreshKeys}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Refresh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Key</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Label</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bound</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {keys.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
                          No keys created yet. Generate your first key to get started.
                        </td>
                      </tr>
                    ) : (
                      keys.map((key) => {
                        const status = formatStatus(key);
                        return (
                          <tr key={key.key} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-4 py-3">
                              <code className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                {key.key}
                              </code>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                              {key.label || <span className="text-gray-400 dark:text-gray-500 italic">—</span>}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(key.createdAt)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              {key.boundAt ? formatDate(key.boundAt) : <span className="italic">—</span>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleCopy(key.key)}
                                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
                                >
                                  {copiedKey === key.key ? 'Copied!' : 'Copy'}
                                </button>
                                {key.isActive && (
                                  <button
                                    onClick={() => handleRevoke(key.key)}
                                    className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                  >
                                    Revoke
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};