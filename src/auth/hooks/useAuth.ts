import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store';

export const useAuth = () => {
  const {
    isAuthenticated,
    user,
    key,
    deviceId,
    isAdmin,
    login,
    logout,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = useCallback(async (inputKey: string) => {
    return await login(inputKey);
  }, [login]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return {
    isAuthenticated,
    isAdmin,
    user,
    key,
    deviceId,
    login: handleLogin,
    logout: handleLogout,
    checkAuth,
  };
};

export const useAdmin = () => {
  const { isAdmin, adminKeys, createKey, createKeys, revokeKey, listKeys } = useAuthStore();
  return { isAdmin, adminKeys, createKey, createKeys, revokeKey, listKeys };
};