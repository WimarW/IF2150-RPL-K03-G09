
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const defaultApiUrl =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api';

const rawEnvUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const API_BASE_URL: string = (
  rawEnvUrl && rawEnvUrl.length > 0 ? rawEnvUrl : defaultApiUrl
).replace(/\/+$/, '');

export const REQUEST_TIMEOUT_MS = 15000;

export type Role = 'PELANGGAN' | 'PEMBERI_JASA' | 'LAYANAN_PELANGGAN';

export interface SessionUser {
  idPengguna: string;
  namaPengguna: string;
  username: string;
  role: Role;
}


export const DEV_USER: SessionUser = {
  idPengguna: '111e8400-e29b-41d4-a716-446655440001',
  namaPengguna: 'Budi Santoso',
  username: 'budi_pelanggan',
  role: 'PELANGGAN',
};

type SessionListener = (user: SessionUser) => void;

let currentSessionUser: SessionUser = { ...DEV_USER };
const sessionListeners = new Set<SessionListener>();

export function getCurrentUser(): SessionUser {
  return currentSessionUser;
}

export function setCurrentUserRole(role: Role): void {
  currentSessionUser = {
    ...currentSessionUser,
    role,
  };
  sessionListeners.forEach((listener) => listener(currentSessionUser));
}

export function subscribeSession(listener: SessionListener): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export interface UseSessionUserResult {
  user: SessionUser;
  setRole: (role: Role) => void;
  isPenyediaJasa: boolean;
}


export function useSessionUser(): UseSessionUserResult {
  const [user, setUser] = useState<SessionUser>(() => getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
    return subscribeSession((updatedUser) => {
      setUser(updatedUser);
    });
  }, []);

  const setRole = useCallback((role: Role) => {
    setCurrentUserRole(role);
  }, []);

  return {
    user,
    setRole,
    isPenyediaJasa: user.role === 'PEMBERI_JASA',
  };
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function buildUrl(path: string): string {
  const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export async function apiRequest<T>(
  path: string,
  options?: ApiRequestOptions
): Promise<T> {
  const method: HttpMethod = options?.method ?? 'GET';
  const url = buildUrl(path);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body:
        options?.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timeoutId);
    throw new ApiError(
      'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      0
    );
  }

  clearTimeout(timeoutId);

  let json: ApiResponse<T> | null = null;
  try {
    const rawText = await response.text();
    if (rawText.trim().length > 0) {
      json = JSON.parse(rawText) as ApiResponse<T>;
    }
  } catch {
    json = null;
  }

  if (!response.ok || (json !== null && json.success === false)) {
    const errorMessage =
      json?.message && json.message.trim().length > 0
        ? json.message
        : 'Terjadi kesalahan pada server';
    throw new ApiError(errorMessage, response.status);
  }

  return (json?.data ?? (json as unknown as T)) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path, { method: 'GET' });
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiRequest<T>(path, { method: 'POST', body });
}
