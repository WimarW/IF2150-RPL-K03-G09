const DEFAULT_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) ||
  'http://localhost:5000/api';

let authToken: string | null = null;

export const setApiAuthToken = (token: string | null): void => {
  authToken = token;
};

export const getApiAuthToken = (): string | null => {
  return authToken;
};

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  success: boolean;
  message?: string;
  data?: T;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${DEFAULT_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const json = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      data?: T;
    };

    return {
      ok: response.ok,
      status: response.status,
      success: Boolean(json.success ?? response.ok),
      message: json.message,
      data: json.data,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
