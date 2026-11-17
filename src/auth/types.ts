export interface AuthKey {
  key: string;
  createdAt: number;
  createdBy: 'admin';
  maxDevices: 1;
  boundDeviceId?: string;
  boundAt?: number;
  isActive: boolean;
  userId?: string;
  label?: string;
}

export interface DeviceFingerprint {
  udid: string;
  platform: string;
  userAgent: string;
  screenResolution: string;
  boundAt: number;
}

export interface AuthUser {
  id: string;
  key: string;
  deviceId: string;
  createdAt: number;
  lastActiveAt: number;
  name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  key: string | null;
  deviceId: string | null;

  isAdmin: boolean;
  adminKeys: AuthKey[];

  login: (key: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;

  createKey: (label?: string) => Promise<AuthKey>;
  createKeys: (count: number, labelPrefix?: string) => Promise<AuthKey[]>;
  revokeKey: (key: string) => Promise<boolean>;
  listKeys: () => AuthKey[];
  validateKey: (key: string) => { valid: boolean; keyData?: AuthKey; error?: string };
  bindDevice: (key: string, deviceId: string) => Promise<{ success: boolean; error?: string }>;
}

export const STORAGE_KEYS = {
  AUTH: 'orbitt-auth',
  ADMIN: 'orbitt-admin',
  KEYS: 'orbitt-keys',
  DEVICE_ID: 'orbitt-device-id',
} as const;

// Admin password - in production, use environment variable
export const getAdminPassword = () => import.meta.env.VITE_ADMIN_PASSWORD || 'orbitt-admin-2024';