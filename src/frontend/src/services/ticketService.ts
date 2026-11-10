/**
 * Service tiket laporan & Layanan Pelanggan (UC08, UC09).
 * Berdiri sendiri (tidak bergantung pada services/api.ts) supaya aman saat merge ke develop.
 */
import { Platform } from 'react-native';

const defaultApiUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';
const rawEnvUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
export const API_BASE_URL = (rawEnvUrl && rawEnvUrl.length > 0 ? rawEnvUrl : defaultApiUrl).replace(/\/+$/, '');
const SERVER_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

export type Role = 'PELANGGAN' | 'PEMBERI_JASA' | 'LAYANAN_PELANGGAN';

let authToken: string | null = null;
let currentRole: Role = 'PELANGGAN';

/** Panggil setelah login berhasil: token & role dari POST /api/auth/login. */
export function setTicketSession(token: string | null, role: Role) {
  authToken = token;
  currentRole = role;
}
export const getRole = () => currentRole;
export const isCS = () => currentRole === 'LAYANAN_PELANGGAN';
export const imageUrl = (p?: string | null) => (p ? `${SERVER_ORIGIN}${p}` : null);

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

/** path relatif terhadap API_BASE_URL, contoh '/tickets/mine'. Mengembalikan field `data`. */
export async function api<T = any>(path: string, opts: { method?: string; json?: unknown; form?: FormData } = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  let body: any;
  if (opts.json !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(opts.json); }
  if (opts.form) body = opts.form; // Content-Type multipart diisi otomatis

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { method: opts.method ?? 'GET', headers, body });
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.', 0);
  }
  const json: any = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    throw new ApiError(json?.message ?? 'Terjadi kesalahan pada server', res.status);
  }
  return (json?.data ?? json) as T;
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
