/**
 * Service tiket laporan & Layanan Pelanggan (UC08, UC09).
 * Memakai sesi & API_BASE_URL dari ./api (sama dengan fitur chat), plus token JWT untuk endpoint tiket.
 */
import { API_BASE_URL, ApiError, Role, getApiAuthToken, getCurrentUser, setCurrentUserRole } from './api';

export { ApiError };
export type { Role };

const SERVER_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

// ===== Mode development (selama halaman login belum ada) =====
// EXPO_PUBLIC_DEV_ROLE=LAYANAN_PELANGGAN -> aplikasi dibuka sebagai CS (langsung ke Beranda CS)
const DEV_ROLE = process.env.EXPO_PUBLIC_DEV_ROLE?.trim() as Role | undefined;
if (DEV_ROLE === 'PELANGGAN' || DEV_ROLE === 'PEMBERI_JASA' || DEV_ROLE === 'LAYANAN_PELANGGAN') {
  setCurrentUserRole(DEV_ROLE);
}

let authToken: string | null = null;
let tokenOwner = ''; // "idPengguna:role" pemilik token yang tersimpan
let sessionRoleOverride: Role | null = null;

/** Panggil setelah login asli berhasil (token dari POST /api/auth/login). */
export function setTicketSession(token: string | null, role?: Role) {
  sessionRoleOverride = role ?? null;
  const u = getCurrentUser();
  const effectiveRole = role ?? u.role;
  if (token && !token.startsWith('local-jwt-')) {
    authToken = token;
    tokenOwner = `${u.idPengguna}:${effectiveRole}`;
  } else {
    authToken = null;
    tokenOwner = '';
  }
}

export const getRole = (): Role => sessionRoleOverride ?? getCurrentUser().role;
export const isCS = () => getRole() === 'LAYANAN_PELANGGAN';
export const imageUrl = (p?: string | null) => {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  return `${SERVER_ORIGIN}${p.startsWith('/') ? p : `/${p}`}`;
};

/**
 * Ambil token. Kalau belum login asli, minta token development ke backend
 * (POST /api/auth/dev-token, aktif bila backend dijalankan dengan ENABLE_DEV_TOKEN=true).
 */
async function getToken(forceRefresh = false): Promise<string | null> {
  const u = getCurrentUser();
  const effectiveRole = sessionRoleOverride ?? u.role;
  const owner = `${u.idPengguna}:${effectiveRole}`;
  if (forceRefresh) {
    authToken = null;
    tokenOwner = '';
  } else {
    const apiToken = getApiAuthToken();
    if (!authToken && apiToken && !apiToken.startsWith('local-jwt-')) {
      authToken = apiToken;
      tokenOwner = owner;
    }
    if (authToken && tokenOwner === owner) return authToken;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/auth/dev-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        idPengguna: u.idPengguna,
        namaPengguna: u.namaPengguna,
        email: u.email,
        role: effectiveRole,
      }),
    });
    const json: any = await res.json().catch(() => null);
    if (res.ok && json?.data?.token) {
      authToken = json.data.token;
      tokenOwner = owner;
      return authToken;
    }
  } catch {
    // diteruskan sebagai 401 oleh request utama
  }
  return authToken;
}

/** path relatif terhadap API_BASE_URL, contoh '/tickets/mine'. Mengembalikan field `data`. */
export async function api<T = any>(path: string, opts: { method?: string; json?: unknown; form?: FormData } = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const method = opts.method ?? 'GET';

  const sendOnce = async (forceRefresh: boolean): Promise<{ status: number; json: any }> => {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const token = await getToken(forceRefresh);
    if (token) headers.Authorization = `Bearer ${token}`;
    let body: any;
    if (opts.json !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(opts.json);
    }
    if (opts.form) body = opts.form; // Content-Type multipart diisi otomatis

    if (opts.form) {
      return sendMultipart(url, method, headers, opts.form);
    }
    const res = await fetch(url, { method, headers, body });
    const parsed = await res.json().catch(() => null);
    return { status: res.status, json: parsed };
  };

  let status: number;
  let json: any;
  try {
    ({ status, json } = await sendOnce(false));
    if (status === 401) {
      ({ status, json } = await sendOnce(true));
    }
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 0);
  }
  if (status === 401) {
    throw new ApiError('Sesi tidak valid. Silakan login (atau aktifkan ENABLE_DEV_TOKEN di backend).', 401);
  }
  if (status < 200 || status >= 300 || json?.success === false) {
    throw new ApiError(json?.message ?? 'Terjadi kesalahan pada server', status);
  }
  return (json?.data ?? json) as T;
}

/**
 * Kirim FormData lewat XMLHttpRequest.
 * `fetch` global di Expo 58 adalah expo/fetch, yang TIDAK mendukung file React Native
 * berbentuk { uri, name, type } (melempar "Unsupported FormDataPart implementation").
 * XHR bawaan React Native mendukungnya secara native.
 */
function sendMultipart(url: string, method: string, headers: Record<string, string>, form: FormData): Promise<{ status: number; json: any }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v)); // Content-Type multipart diisi otomatis
    xhr.timeout = 60000;
    xhr.onload = () => {
      let json: any = null;
      try { json = JSON.parse(xhr.responseText); } catch { /* bukan JSON */ }
      resolve({ status: xhr.status, json });
    };
    xhr.onerror = () => reject(new Error('network'));
    xhr.ontimeout = () => reject(new Error('timeout'));
    xhr.send(form);
  });
}

export const formatWaktu = (iso: string) =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
export const formatTanggal = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const waktuRelatif = (iso: string) => {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m} menit lalu`;
  if (m < 1440) return `${Math.floor(m / 60)} jam lalu`;
  return `${Math.floor(m / 1440)} hari lalu`;
};

const AVATAR_COLORS = ['#E3F2FD', '#E8F5E9', '#FFF3E0', '#FCE4EC', '#EDE7F6'];
export const avatarColor = (s: string) => AVATAR_COLORS[(s.charCodeAt(s.length - 1) || 0) % AVATAR_COLORS.length];
