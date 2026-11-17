import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, AuthKey, AuthUser, DeviceFingerprint, STORAGE_KEYS } from './types';
import { getAdminPassword } from './types';

function generateKey(): string {
  return 'orbitt-' + crypto.randomUUID().replace(/-/g, '').slice(0, 24);
}

function generateDeviceId(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx?.fillText('fingerprint', 10, 10);
  const canvasFingerprint = canvas.toDataURL().slice(-20);

  const entropy = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvasFingerprint,
    crypto.randomUUID(),
  ].join('|');

  let hash = 0;
  for (let i = 0; i < entropy.length; i++) {
    hash = ((hash << 5) - hash) + entropy.charCodeAt(i);
    hash |= 0;
  }
  return 'dev-' + Math.abs(hash).toString(36) + '-' + crypto.randomUUID().slice(0, 8);
}

function getDeviceFingerprint(): DeviceFingerprint {
  return {
    udid: generateDeviceId(),
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    boundAt: Date.now(),
  };
}

function loadKeys(): AuthKey[] {
  try {
    const stored = localStorage.getItem('orbitt-keys');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    // Handle both array format (new) and object format (legacy)
    if (Array.isArray(parsed)) return parsed;
    return Object.values(parsed);
  } catch {
    return [];
  }
}

function saveKeys(keys: AuthKey[]): void {
  localStorage.setItem('orbitt-keys', JSON.stringify(keys));
}

function validateKeyFormat(key: string): boolean {
  return /^orbitt-[a-z0-9]{24,}$/.test(key);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      key: null,
      deviceId: null,
      isAdmin: false,
      adminKeys: [],

      login: async (inputKey: string) => {
        const key = inputKey.trim();
        if (!validateKeyFormat(key)) {
          return { success: false, error: 'Invalid key format' };
        }

        const keys = loadKeys();
        const keyData = keys.find(k => k.key === key);

        if (!keyData) {
          return { success: false, error: 'Key not found' };
        }

        if (!keyData.isActive) {
          return { success: false, error: 'Key has been revoked' };
        }

        const deviceId = getDeviceFingerprint().udid;

        if (keyData.boundDeviceId && keyData.boundDeviceId !== deviceId) {
          return {
            success: false,
            error: 'This key is already bound to another device. Each key can only be used on one phone.',
          };
        }

        // Bind device if not already bound
        if (!keyData.boundDeviceId) {
          keyData.boundDeviceId = deviceId;
          keyData.boundAt = Date.now();
          saveKeys(keys);
        }

        const user: AuthUser = {
          id: crypto.randomUUID(),
          key: keyData.key,
          deviceId,
          createdAt: keyData.boundAt || Date.now(),
          lastActiveAt: Date.now(),
        };

        set({
          isAuthenticated: true,
          user,
          key: keyData.key,
          deviceId,
        });

        return { success: true };
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          key: null,
          deviceId: null,
          isAdmin: false,
        });
      },

      checkAuth: async () => {
        const state = get();
        if (!state.isAuthenticated || !state.user || !state.key) {
          return false;
        }

        const keys = loadKeys();
        const keyData = keys.find(k => k.key === state.key);

        if (!keyData || !keyData.isActive) {
          get().logout();
          return false;
        }

        const deviceId = getDeviceFingerprint().udid;
        if (keyData.boundDeviceId && keyData.boundDeviceId !== deviceId) {
          get().logout();
          return false;
        }

        // Update last active
        if (state.user) {
          set({ user: { ...state.user, lastActiveAt: Date.now() } });
        }

        return true;
      },

      // Admin actions
      createKey: async (label?: string) => {
        const keys = loadKeys();
        const newKey: AuthKey = {
          key: generateKey(),
          createdAt: Date.now(),
          createdBy: 'admin',
          maxDevices: 1,
          isActive: true,
          label,
        };
        keys.push(newKey);
        saveKeys(keys);
        set({ adminKeys: keys });
        return newKey;
      },

      createKeys: async (count: number, labelPrefix?: string) => {
        const keys = loadKeys();
        const newKeys: AuthKey[] = [];
        for (let i = 0; i < count; i++) {
          const newKey: AuthKey = {
            key: generateKey(),
            createdAt: Date.now(),
            createdBy: 'admin',
            maxDevices: 1,
            isActive: true,
            label: labelPrefix ? `${labelPrefix}-${i + 1}` : undefined,
          };
          keys.push(newKey);
          newKeys.push(newKey);
        }
        saveKeys(keys);
        set({ adminKeys: keys });
        return newKeys;
      },

      revokeKey: async (key: string) => {
        const keys = loadKeys();
        const index = keys.findIndex(k => k.key === key);
        if (index === -1) return false;
        keys[index].isActive = false;
        saveKeys(keys);
        set({ adminKeys: keys });
        return true;
      },

      listKeys: () => {
        return loadKeys();
      },

      validateKey: (key: string) => {
        if (!validateKeyFormat(key)) {
          return { valid: false, error: 'Invalid key format' };
        }
        const keys = loadKeys();
        const keyData = keys.find(k => k.key === key);
        if (!keyData) {
          return { valid: false, error: 'Key not found' };
        }
        if (!keyData.isActive) {
          return { valid: false, error: 'Key has been revoked' };
        }
        return { valid: true, keyData };
      },

      bindDevice: async (key: string, deviceId: string) => {
        const keys = loadKeys();
        const keyData = keys.find(k => k.key === key);
        if (!keyData) {
          return { success: false, error: 'Key not found' };
        }
        if (keyData.boundDeviceId && keyData.boundDeviceId !== deviceId) {
          return { success: false, error: 'Key already bound to another device' };
        }
        keyData.boundDeviceId = deviceId;
        keyData.boundAt = Date.now();
        saveKeys(keys);
        set({ adminKeys: keys });
        return { success: true };
      },
    }),
    {
      name: 'orbitt-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        key: state.key,
        deviceId: state.deviceId,
        isAdmin: state.isAdmin,
      }),
    }
  )
);

// Initialize device ID on load
if (typeof window !== 'undefined') {
  let deviceId = localStorage.getItem('orbitt-device-id');
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('orbitt-device-id', deviceId);
  }
  useAuthStore.setState({ deviceId });
}