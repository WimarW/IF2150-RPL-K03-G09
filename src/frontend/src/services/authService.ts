import {
  apiAuthRequest,
  DEV_USER,
  setApiAuthToken,
  setCurrentSessionUser,
} from './api';
import { setTicketSession } from './ticketService';
import { UserProfile, UserRole } from '../navigation/types';

export interface LoginPayload {
  identifier: string; // email or username
  password: string;
}

export interface RegisterCustomerPayload {
  namaPengguna: string;
  email: string;
  password: string;
  username?: string;
  nomorTelpon?: string;
}

export interface RegisterProviderPayload extends RegisterCustomerPayload {
  namaToko: string;
  idKategoriJasa: string;
  jenisJasa: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateProfilePayload {
  namaPengguna: string;
  email: string;
  password?: string;
  nomorTelpon?: string;
  avatarUrl?: string | null;
}

export interface AuthSessionData {
  token: string;
  user: UserProfile;
}

interface LocalUserRecord extends UserProfile {
  passwordPlain: string;
  acceptedPasswords?: string[];
}

// Penyimpanan lokal in-memory untuk fallback development ketika perangkat menggunakan Expo Tunnel (--tunnel)
// sehingga localhost:5000 pada PC tidak dapat dijangkau langsung oleh jaringan seluler/Wi-Fi HP.
const localUsersStore: LocalUserRecord[] = __DEV__
  ? [
      {
        idPengguna: '111e8400-e29b-41d4-a716-446655440001',
      namaPengguna: 'Budi Santoso',
      username: 'budi_pelanggan',
      email: 'budi@pelanggan.com',
      nomorTelpon: '081234567890',
      nomorTelepon: '081234567890',
      role: 'PELANGGAN',
      avatarUrl: null,
      akumulasiRating: 4.8,
      riwayatRating: [5.0, 4.6],
      passwordPlain: 'PasswordAman123',
      acceptedPasswords: ['PasswordAman123', 'password123'],
    },
    {
      idPengguna: '111e8400-e29b-41d4-a716-446655440002',
      namaPengguna: 'Budi Santoso',
      username: 'budi_example',
      email: 'budi@example.com',
      nomorTelpon: '081234567890',
      nomorTelepon: '081234567890',
      role: 'PELANGGAN',
      avatarUrl: null,
      akumulasiRating: 4.8,
      riwayatRating: [5.0, 4.6],
      passwordPlain: 'PasswordAman123',
      acceptedPasswords: ['PasswordAman123', 'password123', 'hashed_password_123'],
    },
    {
      idPengguna: 'usr-pelanggan-001',
      namaPengguna: 'Naufal Hasbialhaq',
      username: 'naufal',
      email: 'naufal.h@example.com',
      nomorTelpon: '081234567890',
      nomorTelepon: '081234567890',
      role: 'PELANGGAN',
      avatarUrl: null,
      akumulasiRating: 4.9,
      riwayatRating: [5, 4.8],
      passwordPlain: 'password123',
      acceptedPasswords: ['password123', 'PasswordAman123'],
    },
    {
      idPengguna: '222e8400-e29b-41d4-a716-446655440001',
      namaPengguna: 'Ahmad Teknik',
      username: 'ahmad_teknik',
      email: 'ahmad@cariuang.id',
      nomorTelpon: '081298765431',
      nomorTelepon: '081298765431',
      role: 'PEMBERI_JASA',
      avatarUrl: null,
      akumulasiRating: 4.9,
      riwayatRating: [5.0, 4.8, 4.9],
      pemberiJasa: {
        idPemberiJasa: '222e8400-e29b-41d4-a716-446655440001',
        namaToko: 'Ahmad Jaya AC & Elektronik',
        idKategoriJasa: '550e8400-e29b-41d4-a716-446655440002',
        jenisJasa: 'Perbaikan Elektronik & AC',
        statusKetersediaan: 'Available',
        isOnline: true,
      },
      passwordPlain: 'PasswordAman123',
      acceptedPasswords: ['PasswordAman123', 'password123', 'hashed_password_123'],
    },
    {
      idPengguna: '222e8400-e29b-41d4-a716-446655440002',
      namaPengguna: 'Siti Bersih',
      username: 'siti_clean',
      email: 'siti@cariuang.id',
      nomorTelpon: '081298765432',
      nomorTelepon: '081298765432',
      role: 'PEMBERI_JASA',
      avatarUrl: null,
      akumulasiRating: 4.7,
      riwayatRating: [4.7],
      pemberiJasa: {
        idPemberiJasa: '222e8400-e29b-41d4-a716-446655440002',
        namaToko: 'Kinclong Home Cleaning',
        idKategoriJasa: '550e8400-e29b-41d4-a716-446655440001',
        jenisJasa: 'Jasa Kebersihan Rumah',
        statusKetersediaan: 'Available',
        isOnline: true,
      },
      passwordPlain: 'PasswordAman123',
      acceptedPasswords: ['PasswordAman123', 'password123', 'hashed_password_123'],
    },
    {
      idPengguna: 'usr-provider-001',
      namaPengguna: 'Budi Wijaya',
      username: 'budi_jasa',
      email: 'budi.wijaya@example.com',
      nomorTelpon: '081298765432',
      nomorTelepon: '081298765432',
      role: 'PEMBERI_JASA',
      avatarUrl: null,
      akumulasiRating: 5.0,
      riwayatRating: [5, 5],
      pemberiJasa: {
        idPemberiJasa: 'usr-provider-001',
        namaToko: 'Servis & Renovasi Budi',
        idKategoriJasa: 'kat-servis',
        jenisJasa: 'Servis',
        statusKetersediaan: 'Available',
        isOnline: true,
      },
      passwordPlain: 'password123',
      acceptedPasswords: ['password123', 'PasswordAman123'],
    },
    {
      idPengguna: '444e8400-e29b-41d4-a716-446655440001',
      namaPengguna: 'Rina Customer Care',
      username: 'cs_cariuang',
      email: 'cs@cariuang.id',
      nomorTelpon: '081100001111',
      nomorTelepon: '081100001111',
      role: 'LAYANAN_PELANGGAN',
      avatarUrl: null,
      akumulasiRating: 0,
      riwayatRating: [],
      layananPelanggan: {
        idLayananPelanggan: '444e8400-e29b-41d4-a716-446655440001',
        status: 'Available',
        jumlahTiketDipegang: 2,
      },
      passwordPlain: 'PasswordAman123',
      acceptedPasswords: ['PasswordAman123', 'password123', 'hashed_password_123'],
    },
  ]
  : [];
function syncSessionUser(user: UserProfile, token?: string | null): void {
  setCurrentSessionUser({
    idPengguna: user.idPengguna,
    namaPengguna: user.namaPengguna,
    email: user.email,
    role: user.role,
    idPemberiJasa:
      user.role === 'PEMBERI_JASA'
        ? user.pemberiJasa?.idPemberiJasa || user.idPengguna
        : undefined,
  });
  if (token !== undefined) {
    setTicketSession(token, user.role);
  }
}

function buildDerivedUsername(email: string, explicitUsername?: string): string {
  if (explicitUsername && explicitUsername.trim().length > 0) {
    return explicitUsername.trim();
  }
  const base = email
    .split('@')[0]
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .toLowerCase();
  const suffix = String(Date.now()).slice(-4);
  return `${base || 'user'}_${suffix}`;
}

function normalizePhone(nomorTelpon?: string): string {
  const cleaned = (nomorTelpon ?? '').replace(/[^0-9]/g, '');
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return cleaned;
  }
  return '081234567890';
}

export const authService = {
  /**
   * UC11 - Login Pengguna (Pelanggan, Pemberi Jasa, atau Layanan Pelanggan)
   */
  async login(payload: LoginPayload): Promise<{
    success: boolean;
    message: string;
    data?: AuthSessionData;
  }> {
    const cleanId = payload.identifier.trim();
    const rawPassword = payload.password;

    try {
      const response = await apiAuthRequest<AuthSessionData>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: cleanId,
          email: cleanId.toLowerCase(),
          password: rawPassword,
        }),
      });

      if (response.ok && response.data?.token && response.data?.user) {
        setApiAuthToken(response.data.token);
        syncSessionUser(response.data.user, response.data.token);
        return {
          success: true,
          message: response.message || 'Login berhasil.',
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Email atau password salah',
      };
    } catch {
      // Pada production build, selalu kembalikan pesan kegagalan server
      if (!__DEV__) {
        return {
          success: false,
          message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        };
      }

      // Fallback ke store lokal saat development (mis. saat Expo Tunnel --tunnel)
      const matched = localUsersStore.find(
        (u) =>
          u.email.toLowerCase() === cleanId.toLowerCase() ||
          u.username.toLowerCase() === cleanId.toLowerCase()
      );

      const isPasswordValid =
        Boolean(matched) &&
        (matched!.passwordPlain === rawPassword ||
          Boolean(matched!.acceptedPasswords?.includes(rawPassword)));

      if (!matched || !isPasswordValid) {
        return {
          success: false,
          message: 'Email atau password salah',
        };
      }

      const {
        passwordPlain: _,
        acceptedPasswords: __,
        ...safeUser
      } = matched;
      const mockToken = `local-jwt-${safeUser.idPengguna}-${Date.now()}`;
      setApiAuthToken(mockToken);
      syncSessionUser(safeUser, mockToken);

      return {
        success: true,
        message: 'Login berhasil.',
        data: {
          token: mockToken,
          user: safeUser,
        },
      };
    }
  },

  /**
   * UC12 - Registrasi Pelanggan (POST /api/auth/register/pelanggan)
   */
  async registerCustomer(payload: RegisterCustomerPayload): Promise<{
    success: boolean;
    message: string;
    data?: AuthSessionData;
  }> {
    const username = buildDerivedUsername(payload.email, payload.username);
    const nomorTelpon = normalizePhone(payload.nomorTelpon);
    const email = payload.email.trim().toLowerCase();
    const namaPengguna = payload.namaPengguna.trim();

    try {
      const response = await apiAuthRequest<UserProfile>(
        '/auth/register/pelanggan',
        {
          method: 'POST',
          body: JSON.stringify({
            namaPengguna,
            username,
            email,
            password: payload.password,
            nomorTelpon,
            nomorTelepon: nomorTelpon,
          }),
        }
      );

      if (!response.ok || !response.data) {
        return {
          success: false,
          message: response.message || 'Registrasi pelanggan gagal.',
        };
      }

      // Otomatis login setelah registrasi berhasil agar langsung menuju Beranda (UI-04)
      const loginResp = await this.login({
        identifier: email,
        password: payload.password,
      });

      if (loginResp.success && loginResp.data) {
        return {
          success: true,
          message: 'Registrasi pelanggan berhasil.',
          data: loginResp.data,
        };
      }

      const fallbackToken = `jwt-${response.data.idPengguna}`;
      setApiAuthToken(fallbackToken);
      syncSessionUser(response.data, fallbackToken);
      return {
        success: true,
        message: 'Registrasi pelanggan berhasil.',
        data: {
          token: fallbackToken,
          user: response.data,
        },
      };
    } catch {
      if (!__DEV__) {
        return {
          success: false,
          message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        };
      }

      const exists = localUsersStore.some(
        (u) =>
          u.email.toLowerCase() === email ||
          u.username.toLowerCase() === username.toLowerCase()
      );
      if (exists) {
        return {
          success: false,
          message: 'Email sudah terdaftar. Silakan gunakan alamat email lain.',
        };
      }

      const newUser: UserProfile = {
        idPengguna: `usr-pelanggan-${Date.now()}`,
        namaPengguna,
        username,
        email,
        nomorTelpon,
        nomorTelepon: nomorTelpon,
        role: 'PELANGGAN' as UserRole,
        avatarUrl: null,
        akumulasiRating: 0,
        riwayatRating: [],
      };

      localUsersStore.push({
        ...newUser,
        passwordPlain: payload.password,
        acceptedPasswords: [payload.password],
      });

      const token = `local-jwt-${newUser.idPengguna}`;
      setApiAuthToken(token);
      syncSessionUser(newUser, token);
      return {
        success: true,
        message: 'Registrasi pelanggan berhasil.',
        data: {
          token,
          user: newUser,
        },
      };
    }
  },

  /**
   * UC12 & UC01 - Registrasi Penyedia Jasa (POST /api/auth/register/pemberi-jasa)
   */
  async registerProvider(payload: RegisterProviderPayload): Promise<{
    success: boolean;
    message: string;
    data?: AuthSessionData;
  }> {
    const username = buildDerivedUsername(payload.email, payload.username);
    const nomorTelpon = normalizePhone(payload.nomorTelpon);
    const email = payload.email.trim().toLowerCase();
    const namaPengguna = payload.namaPengguna.trim();
    const namaToko = payload.namaToko.trim() || namaPengguna;
    const jenisJasa = payload.jenisJasa.trim();
    const idKategoriJasa =
      payload.idKategoriJasa.trim() ||
      `kat-${jenisJasa.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    try {
      const response = await apiAuthRequest<UserProfile>(
        '/auth/register/pemberi-jasa',
        {
          method: 'POST',
          body: JSON.stringify({
            namaPengguna,
            username,
            email,
            password: payload.password,
            nomorTelpon,
            nomorTelepon: nomorTelpon,
            namaToko,
            idKategoriJasa,
            jenisJasa,
            latitude: payload.latitude ?? -6.8915,
            longitude: payload.longitude ?? 107.6107,
          }),
        }
      );

      if (!response.ok || !response.data) {
        return {
          success: false,
          message: response.message || 'Registrasi penyedia jasa gagal.',
        };
      }

      const loginResp = await this.login({
        identifier: email,
        password: payload.password,
      });

      if (loginResp.success && loginResp.data) {
        return {
          success: true,
          message: 'Registrasi pemberi jasa berhasil.',
          data: loginResp.data,
        };
      }

      const fallbackToken = `jwt-${response.data.idPengguna}`;
      const providerUser: UserProfile = {
        ...response.data,
        role: 'PEMBERI_JASA',
      };
      setApiAuthToken(fallbackToken);
      syncSessionUser(providerUser, fallbackToken);
      return {
        success: true,
        message: 'Registrasi pemberi jasa berhasil.',
        data: {
          token: fallbackToken,
          user: providerUser,
        },
      };
    } catch {
      if (!__DEV__) {
        return {
          success: false,
          message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        };
      }

      const exists = localUsersStore.some(
        (u) =>
          u.email.toLowerCase() === email ||
          u.username.toLowerCase() === username.toLowerCase()
      );
      if (exists) {
        return {
          success: false,
          message: 'Email sudah terdaftar. Silakan gunakan alamat email lain.',
        };
      }

      const id = `usr-provider-${Date.now()}`;
      const newProvider: UserProfile = {
        idPengguna: id,
        namaPengguna,
        username,
        email,
        nomorTelpon,
        nomorTelepon: nomorTelpon,
        role: 'PEMBERI_JASA',
        avatarUrl: null,
        akumulasiRating: 0,
        riwayatRating: [],
        pemberiJasa: {
          idPemberiJasa: id,
          namaToko,
          idKategoriJasa,
          jenisJasa,
          statusKetersediaan: 'Available',
          isOnline: true,
        },
      };

      localUsersStore.push({
        ...newProvider,
        passwordPlain: payload.password,
        acceptedPasswords: [payload.password],
      });

      const token = `local-jwt-${newProvider.idPengguna}`;
      setApiAuthToken(token);
      syncSessionUser(newProvider, token);
      return {
        success: true,
        message: 'Registrasi pemberi jasa berhasil.',
        data: {
          token,
          user: newProvider,
        },
      };
    }
  },

  /**
   * Mengambil Profil Pengguna (GET /api/users/profile)
   */
  async getProfile(currentUser: UserProfile | null): Promise<{
    success: boolean;
    data?: UserProfile;
    message?: string;
  }> {
    try {
      const response = await apiAuthRequest<UserProfile>('/users/profile', {
        method: 'GET',
      });
      if (response.ok && response.data) {
        syncSessionUser(response.data);
        return { success: true, data: response.data };
      }
      return {
        success: false,
        message: response.message || 'Gagal memuat profil pengguna.',
      };
    } catch {
      if (currentUser) {
        return { success: true, data: currentUser };
      }
      return { success: false, message: 'Gagal memuat profil pengguna.' };
    }
  },

  /**
   * Memperbarui Profil Pengguna (PUT /api/users/profile)
   */
  async updateProfile(
    currentUser: UserProfile,
    payload: UpdateProfilePayload
  ): Promise<{
    success: boolean;
    message: string;
    data?: UserProfile;
  }> {
    const nomorTelpon = normalizePhone(
      payload.nomorTelpon ?? currentUser.nomorTelpon ?? currentUser.nomorTelepon
    );
    const namaPengguna = payload.namaPengguna.trim();
    const email = payload.email.trim().toLowerCase();

    try {
      const response = await apiAuthRequest<UserProfile>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          namaPengguna,
          email,
          nomorTelpon,
          nomorTelepon: nomorTelpon,
          avatarUrl: payload.avatarUrl ?? currentUser.avatarUrl,
        }),
      });

      if (response.ok && response.data) {
        syncSessionUser(response.data);
        return {
          success: true,
          message: response.message || 'Profil berhasil diperbarui.',
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Gagal memperbarui profil pengguna.',
      };
    } catch {
      if (!__DEV__) {
        return {
          success: false,
          message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        };
      }

      const duplicate = localUsersStore.find(
        (u) =>
          u.email.toLowerCase() === email &&
          u.idPengguna !== currentUser.idPengguna
      );
      if (duplicate) {
        return {
          success: false,
          message: 'Email sudah digunakan oleh akun lain.',
        };
      }

      const updatedUser: UserProfile = {
        ...currentUser,
        namaPengguna,
        email,
        nomorTelpon,
        nomorTelepon: nomorTelpon,
        avatarUrl:
          payload.avatarUrl !== undefined
            ? payload.avatarUrl
            : currentUser.avatarUrl,
      };

      const idx = localUsersStore.findIndex(
        (u) => u.idPengguna === currentUser.idPengguna
      );
      if (idx !== -1) {
        const nextPassword =
          payload.password && payload.password.length >= 8
            ? payload.password
            : localUsersStore[idx].passwordPlain;
        localUsersStore[idx] = {
          ...localUsersStore[idx],
          ...updatedUser,
          passwordPlain: nextPassword,
          acceptedPasswords: Array.from(
            new Set([
              ...(localUsersStore[idx].acceptedPasswords ?? []),
              nextPassword,
            ])
          ),
        };
      }

      syncSessionUser(updatedUser);
      return {
        success: true,
        message: 'Profil berhasil diperbarui.',
        data: updatedUser,
      };
    }
  },

  logout(): void {
    setApiAuthToken(null);
    setCurrentSessionUser({ ...DEV_USER });
    setTicketSession(null, 'PELANGGAN');
  },
};
