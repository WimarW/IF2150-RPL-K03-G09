import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const DEFAULT_PORT = 4000;

function resolveDefaultBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.replace(/\/+$/, '');
  }

  // Android Emulator membutuhkan 10.0.2.2 untuk mengakses host localhost
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${DEFAULT_PORT}/api`;
  }

  return `http://localhost:${DEFAULT_PORT}/api`;
}

export const API_BASE_URL = resolveDefaultBaseUrl();
export const REQUEST_TIMEOUT_MS = 10000;

let authToken: string | null = null;

export const setApiAuthToken = (token: string | null): void => {
  authToken = token;
};

export const getApiAuthToken = (): string | null => authToken;

// ============================================================================
// Manajemen Sesi Pengguna Sementara (Mock Session) & Sinkronisasi Auth
// ============================================================================

export type Role = 'PELANGGAN' | 'PEMBERI_JASA' | 'LAYANAN_PELANGGAN';

export interface SessionUser {
  idPengguna: string;
  namaPengguna: string;
  email: string;
  role: Role;
  idPemberiJasa?: string;
}

/**
 * Data pengguna untuk keperluan development.
 */
export const DEV_USER: SessionUser = {
  idPengguna: 'usr-pelanggan-001',
  namaPengguna: 'Naufal Hasbialhaq',
  email: 'naufal.h@example.com',
  role: 'PELANGGAN',
  idPemberiJasa: undefined,
};

let currentSessionUser: SessionUser = { ...DEV_USER };
const sessionListeners = new Set<(user: SessionUser) => void>();

/**
 * Mengambil informasi pengguna yang sedang aktif pada sesi saat ini.
 */
export function getCurrentUser(): SessionUser {
  return currentSessionUser;
}

/**
 * Memperbarui seluruh data pengguna aktif pada sesi saat ini (dipanggil saat login/registrasi/update profil/logout).
 */
export function setCurrentSessionUser(user: SessionUser): SessionUser {
  currentSessionUser = { ...user };
  sessionListeners.forEach((listener) => listener(currentSessionUser));
  return currentSessionUser;
}

/**
 * Mengubah role pengguna pada sesi saat ini (misal: setelah berhasil registrasi penyedia jasa).
 */
export function setCurrentUserRole(
  role: Role,
  idPemberiJasa?: string
): SessionUser {
  currentSessionUser = {
    ...currentSessionUser,
    role,
    idPemberiJasa:
      role === 'PEMBERI_JASA'
        ? idPemberiJasa ||
          currentSessionUser.idPemberiJasa ||
          currentSessionUser.idPengguna
        : undefined,
  };

  sessionListeners.forEach((listener) => listener(currentSessionUser));
  return currentSessionUser;
}

/**
 * Berlangganan perubahan sesi pengguna secara reaktif.
 */
export function subscribeSession(
  listener: (user: SessionUser) => void
): () => void {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

/**
 * React Hook untuk membaca sesi pengguna secara reaktif di berbagai layar.
 */
export function useSessionUser(): {
  user: SessionUser;
  isPelanggan: boolean;
  isPenyediaJasa: boolean;
  isCS: boolean;
  updateRole: (role: Role, idPemberiJasa?: string) => SessionUser;
} {
  const [user, setUser] = useState<SessionUser>(() => getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
    const unsubscribe = subscribeSession((updatedUser) => {
      setUser(updatedUser);
    });
    return unsubscribe;
  }, []);

  return {
    user,
    isPelanggan: user.role === 'PELANGGAN',
    isPenyediaJasa: user.role === 'PEMBERI_JASA',
    isCS: user.role === 'LAYANAN_PELANGGAN',
    updateRole: setCurrentUserRole,
  };
}

// ============================================================================
// Utilitas Klien HTTP (Fetch Wrapper dengan Timeout & Error Handling)
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiAuthEnvelope<T = unknown> {
  ok: boolean;
  status: number;
  message?: string;
  data?: T;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly details?: unknown;
  public readonly isNetworkError: boolean;

  constructor(
    message: string,
    status = 0,
    details?: unknown,
    isNetworkError = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.isNetworkError = isNetworkError;
  }
}

function isApiEnvelope<T>(payload: unknown): payload is ApiResponse<T> {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    ('success' in payload || 'status' in payload)
  );
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    timeoutMs = REQUEST_TIMEOUT_MS,
    signal,
  } = options;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', onExternalAbort);
    }
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-User-Id': currentSessionUser.idPengguna,
        'X-User-Role': currentSessionUser.role,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      body:
        body !== undefined
          ? typeof body === 'string'
            ? body
            : JSON.stringify(body)
          : undefined,
      signal: controller.signal,
    });

    const rawText = await response.text();
    let parsed: unknown = null;

    if (rawText) {
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = rawText;
      }
    }

    if (!response.ok) {
      const serverMessage =
        typeof parsed === 'object' &&
        parsed !== null &&
        'message' in parsed &&
        typeof (parsed as { message: unknown }).message === 'string'
          ? (parsed as { message: string }).message
          : `Permintaan gagal dengan kode status ${response.status}.`;

      throw new ApiError(serverMessage, response.status, parsed, false);
    }

    if (isApiEnvelope<T>(parsed)) {
      return parsed.data;
    }

    return parsed as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'Waktu koneksi ke server habis. Periksa koneksi internet Anda lalu coba lagi.',
        0,
        undefined,
        true
      );
    }

    throw new ApiError(
      'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
      0,
      error,
      true
    );
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', onExternalAbort);
    }
  }
}

/**
 * Helper khusus endpoint autentikasi & profil yang mengembalikan amplop `{ ok, status, message, data }`.
 */
export async function apiAuthRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiAuthEnvelope<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-User-Id': currentSessionUser.idPengguna,
    'X-User-Role': currentSessionUser.role,
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const normalizedPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({}));

  return {
    ok: response.ok,
    status: response.status,
    message: json.message,
    data: json.data as T | undefined,
  };
}

export function apiGet<T>(
  path: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'GET' });
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(path, { ...options, method: 'POST', body });
}
