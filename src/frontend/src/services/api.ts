import { useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

const DEFAULT_PORT = 5000;

function extractExpoHostIp(): string | null {
  try {
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      window.location?.hostname
    ) {
      return window.location.hostname;
    }

    const scriptURL: string | undefined =
      NativeModules?.SourceCode?.scriptURL;
    if (!scriptURL) return null;
    const match = scriptURL.match(/^https?:\/\/([^/:]+)(?::\d+)?\//i);
    if (!match?.[1]) return null;
    const host = match[1];
    // Abaikan domain tunnel ngrok/expo.dev karena tunnel hanya meneruskan port Metro (8081), bukan port 5000
    if (
      host.includes('ngrok') ||
      host.includes('exp.direct') ||
      host.includes('expo.dev') ||
      host === 'localhost' ||
      host === '127.0.0.1'
    ) {
      return null;
    }
    return host;
  } catch {
    return null;
  }
}

function resolveDefaultBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  const detectedLanHost = extractExpoHostIp();
  if (detectedLanHost) {
    return `http://${detectedLanHost}:${DEFAULT_PORT}/api`;
  }

  // Android Emulator membutuhkan 10.0.2.2 untuk mengakses host localhost:5000
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${DEFAULT_PORT}/api`;
  }

  return `http://localhost:${DEFAULT_PORT}/api`;
}

export const API_BASE_URL = resolveDefaultBaseUrl();
export const REQUEST_TIMEOUT_MS = 3500;
export const AUTH_TIMEOUT_MS = 2000;

/**
 * Daftar kandidat Base URL yang akan dicoba secara berurutan apabila URL utama tidak dapat dijangkau
 * (mis. perbedaan antara Android Emulator 10.0.2.2, iOS/Web/adb-reverse localhost, atau port 5000/3000).
 */
export function getCandidateApiBaseUrls(): string[] {
  const candidates: string[] = [];
  const addCandidate = (url: string) => {
    const clean = url.trim().replace(/\/+$/, '');
    if (clean && !candidates.includes(clean)) {
      candidates.push(clean);
    }
  };

  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    addCandidate(envUrl);
  }

  const detectedLanHost = extractExpoHostIp();
  if (detectedLanHost) {
    addCandidate(`http://${detectedLanHost}:5000/api`);
  }

  if (Platform.OS === 'android') {
    addCandidate('http://10.0.2.2:5000/api');
    addCandidate('http://localhost:5000/api');
  } else {
    addCandidate('http://localhost:5000/api');
    addCandidate('http://10.0.2.2:5000/api');
  }

  return candidates;
}

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
  username?: string;
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
  username: 'budi_pelanggan',
  email: 'naufal.h@example.com',
  role: 'PELANGGAN',
  idPemberiJasa: undefined,
};

export type SessionListener = (user: SessionUser) => void;

let currentSessionUser: SessionUser = { ...DEV_USER };
let devLoginPromise: Promise<string | null> | null = null;
const sessionListeners = new Set<SessionListener>();

export function getAuthToken(): string | null {
  return authToken;
}

export function setAuthToken(
  token: string | null,
  user?: Partial<SessionUser>
): void {
  authToken = token;
  if (user) {
    currentSessionUser = {
      ...currentSessionUser,
      ...user,
    };
    sessionListeners.forEach((listener) => listener(currentSessionUser));
  }
}

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
 * Memastikan sesi dev memiliki JWT token valid dari `POST /api/auth/login`
 * saat belum login manual.
 */
export async function ensureDevAuthToken(): Promise<string | null> {
  if (authToken) {
    return authToken;
  }

  if (typeof process !== 'undefined' && process.env?.JEST_WORKER_ID) {
    return null;
  }

  if (devLoginPromise) {
    return devLoginPromise;
  }

  devLoginPromise = (async () => {
    try {
      const loginData = await apiRequest<{
        token?: string;
        user?: Partial<SessionUser>;
      }>('/auth/login', {
        method: 'POST',
        skipAuth: true,
        body: {
          username: currentSessionUser.username || DEV_USER.username,
          password: 'PasswordAman123',
        },
      });

      if (loginData?.token) {
        setAuthToken(loginData.token, loginData.user);
        return loginData.token;
      }
      return null;
    } catch (err) {
      console.warn(
        '[api] Auto-login dev session gagal:',
        err instanceof Error ? err.message : err
      );
      return null;
    } finally {
      devLoginPromise = null;
    }
  })();

  return devLoginPromise;
}

export interface UseSessionUserResult {
  user: SessionUser;
  isPelanggan: boolean;
  isPenyediaJasa: boolean;
  isCS: boolean;
  updateRole: (role: Role, idPemberiJasa?: string) => SessionUser;
}

export function useSessionUser(): UseSessionUserResult {
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
  skipAuth?: boolean;
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

let lastWorkingBaseUrl: string | null = null;
const unreachableBaseUrls = new Set<string>();

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
  externalSignal?: AbortSignal
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onExternalAbort);
    }
  }

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }
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
    skipAuth = false,
  } = options;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = lastWorkingBaseUrl ?? API_BASE_URL;
  const url = `${baseUrl}${normalizedPath}`;

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-User-Id': currentSessionUser.idPengguna,
          'X-User-Role': currentSessionUser.role,
          ...(!skipAuth && authToken
            ? { Authorization: `Bearer ${authToken}` }
            : {}),
          ...headers,
        },
        body:
          body !== undefined
            ? typeof body === 'string'
              ? body
              : JSON.stringify(body)
            : undefined,
      },
      timeoutMs,
      signal
    );

    lastWorkingBaseUrl = baseUrl;

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
  }
}

/**
 * Helper khusus endpoint autentikasi & profil yang mengembalikan amplop `{ ok, status, message, data }`.
 * Dilengkapi timeout cepat (3.5 detik) dan percobaan multi-host (localhost:5000 / 10.0.2.2:5000)
 * agar tidak pernah stuck loading ketika perangkat menggunakan tunnel atau emulator.
 */
export async function apiAuthRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiAuthEnvelope<T>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-User-Id': currentSessionUser.idPengguna,
    'X-User-Role': currentSessionUser.role,
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const normalizedPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const allCandidates = lastWorkingBaseUrl
    ? [
        lastWorkingBaseUrl,
        ...getCandidateApiBaseUrls().filter((u) => u !== lastWorkingBaseUrl),
      ]
    : getCandidateApiBaseUrls();

  const candidates = allCandidates.filter((u) => !unreachableBaseUrls.has(u));
  if (candidates.length === 0) {
    throw new Error('Backend tidak dapat dijangkau dari jaringan perangkat ini.');
  }

  let lastError: unknown = null;

  for (const baseUrl of candidates) {
    try {
      const response = await fetchWithTimeout(
        `${baseUrl}${normalizedPath}`,
        {
          ...options,
          headers,
        },
        AUTH_TIMEOUT_MS
      );

      lastWorkingBaseUrl = baseUrl;
      unreachableBaseUrls.delete(baseUrl);
      const json = await response.json().catch(() => ({}));

      return {
        ok: response.ok,
        status: response.status,
        message: json.message,
        data: json.data as T | undefined,
      };
    } catch (err) {
      unreachableBaseUrls.add(baseUrl);
      lastError = err;
    }
  }

  throw lastError ?? new Error('Network request failed');
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

export async function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return apiRequest<T>(path, { method: 'PATCH', body });
}
