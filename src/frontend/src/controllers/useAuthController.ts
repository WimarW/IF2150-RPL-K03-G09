import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  UserProfile,
  UserRole,
  ScreenName,
} from '../navigation/types';
import {
  authService,
  RegisterCustomerPayload,
  RegisterProviderPayload,
  UpdateProfilePayload,
} from '../services/authService';

const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface FieldValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface AuthControllerContextValue {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  // Validasi instan (ALGO-012 / ALGO-017 & Acceptance Criteria)
  validateEmailInstant: (value: string, allowUsername?: boolean) => FieldValidationResult;
  validatePasswordInstant: (value: string) => FieldValidationResult;
  validateConfirmPasswordInstant: (password: string, confirmPassword: string) => FieldValidationResult;
  validateRequiredName: (name: string) => FieldValidationResult;
  validasiInfoRegistrasi: (input: {
    namaPengguna: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreedToTerms: boolean;
  }) => { valid: boolean; message?: string };
  // Operasi Kelas Controller (C03 PenggunaController, C06 PemberiJasaController, C09 PelangganController, C12 LayananPelangganController)
  triggerQueryLogin: (
    identifier: string,
    password: string
  ) => Promise<{ success: boolean; targetScreen?: ScreenName; message?: string }>;
  registerPelanggan: (
    payload: RegisterCustomerPayload
  ) => Promise<{ success: boolean; targetScreen?: ScreenName; message?: string }>;
  registerPemberiJasa: (
    payload: RegisterProviderPayload
  ) => Promise<{ success: boolean; targetScreen?: ScreenName; message?: string }>;
  updateUserProfile: (
    payload: UpdateProfilePayload
  ) => Promise<{ success: boolean; message: string }>;
  logoutSession: () => ScreenName;
  getRoleTargetScreen: (role: UserRole) => ScreenName;
}

const AuthControllerContext = createContext<AuthControllerContextValue | undefined>(
  undefined
);

export const AuthControllerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  /**
   * Menentukan layar tujuan beranda berdasarkan role pengguna:
   * - PELANGGAN -> UI-04 (Home)
   * - PEMBERI_JASA -> UI-12 (ProviderHistory)
   * - LAYANAN_PELANGGAN -> UI-17 (CSHome)
   */
  const getRoleTargetScreen = useCallback((role: UserRole): ScreenName => {
    switch (role) {
      case 'PEMBERI_JASA':
        return 'ProviderHistory';
      case 'LAYANAN_PELANGGAN':
        return 'CSHome';
      case 'PELANGGAN':
      default:
        return 'Home';
    }
  }, []);

  /**
   * Validasi instan format email (atau username pada layar Login jika diizinkan)
   */
  const validateEmailInstant = useCallback(
    (value: string, allowUsername = false): FieldValidationResult => {
      const trimmed = value.trim();
      if (!trimmed) {
        return {
          isValid: false,
          errorMessage: 'Email tidak boleh kosong.',
        };
      }

      if (allowUsername && !trimmed.includes('@')) {
        if (trimmed.length < 3) {
          return {
            isValid: false,
            errorMessage: 'Format email atau username tidak valid.',
          };
        }
        return { isValid: true };
      }

      if (!EMAIL_FORMAT_REGEX.test(trimmed)) {
        return {
          isValid: false,
          errorMessage: 'Format alamat email tidak valid.',
        };
      }

      return { isValid: true };
    },
    []
  );

  /**
   * Validasi instan panjang password minimal 8 karakter (ALGO-012 / ALGO-017)
   */
  const validatePasswordInstant = useCallback(
    (value: string): FieldValidationResult => {
      if (!value) {
        return {
          isValid: false,
          errorMessage: 'Password tidak boleh kosong.',
        };
      }
      if (value.length < 8) {
        return {
          isValid: false,
          errorMessage: 'Password harus memiliki panjang minimal 8 karakter.',
        };
      }
      return { isValid: true };
    },
    []
  );

  const validateConfirmPasswordInstant = useCallback(
    (password: string, confirmPassword: string): FieldValidationResult => {
      if (!confirmPassword) {
        return {
          isValid: false,
          errorMessage: 'Konfirmasi password wajib diisi.',
        };
      }
      if (password !== confirmPassword) {
        return {
          isValid: false,
          errorMessage: 'Konfirmasi password tidak cocok.',
        };
      }
      return { isValid: true };
    },
    []
  );

  const validateRequiredName = useCallback(
    (name: string): FieldValidationResult => {
      if (!name.trim()) {
        return {
          isValid: false,
          errorMessage: 'Nama lengkap wajib diisi.',
        };
      }
      return { isValid: true };
    },
    []
  );

  /**
   * Operasi validasiInfoRegistrasi (C03, C06, C09 - ALGO-012 & ALGO-017)
   */
  const validasiInfoRegistrasi = useCallback(
    (input: {
      namaPengguna: string;
      email: string;
      password: string;
      confirmPassword: string;
      agreedToTerms: boolean;
    }): { valid: boolean; message?: string } => {
      const nameCheck = validateRequiredName(input.namaPengguna);
      if (!nameCheck.isValid) {
        return { valid: false, message: nameCheck.errorMessage };
      }

      const emailCheck = validateEmailInstant(input.email, false);
      if (!emailCheck.isValid) {
        return { valid: false, message: emailCheck.errorMessage };
      }

      const passCheck = validatePasswordInstant(input.password);
      if (!passCheck.isValid) {
        return { valid: false, message: passCheck.errorMessage };
      }

      const confirmCheck = validateConfirmPasswordInstant(
        input.password,
        input.confirmPassword
      );
      if (!confirmCheck.isValid) {
        return { valid: false, message: confirmCheck.errorMessage };
      }

      if (!input.agreedToTerms) {
        return {
          valid: false,
          message: 'Kamu harus menyetujui Ketentuan Layanan terlebih dahulu.',
        };
      }

      return { valid: true };
    },
    [
      validateRequiredName,
      validateEmailInstant,
      validatePasswordInstant,
      validateConfirmPasswordInstant,
    ]
  );

  /**
   * Operasi triggerQueryLogin (UC11 Normal & Alternatif 1)
   */
  const triggerQueryLogin = useCallback(
    async (
      identifier: string,
      password: string
    ): Promise<{ success: boolean; targetScreen?: ScreenName; message?: string }> => {
      setAuthError(null);

      const idCheck = validateEmailInstant(identifier, true);
      if (!idCheck.isValid) {
        setAuthError(idCheck.errorMessage || 'Format email tidak valid.');
        return { success: false, message: idCheck.errorMessage };
      }

      if (!password.trim()) {
        const msg = 'Password wajib diisi.';
        setAuthError(msg);
        return { success: false, message: msg };
      }

      setIsLoading(true);
      try {
        const result = await authService.login({ identifier, password });
        if (!result.success || !result.data) {
          const errMessage = result.message || 'Email atau password salah';
          setAuthError(errMessage);
          return { success: false, message: errMessage };
        }

        setToken(result.data.token);
        setUser(result.data.user);
        const targetScreen = getRoleTargetScreen(result.data.user.role);
        return {
          success: true,
          targetScreen,
          message: result.message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [validateEmailInstant, getRoleTargetScreen]
  );

  /**
   * Operasi Registrasi Pelanggan (UC12 Skenario Pelanggan -> menuju UI-04)
   */
  const registerPelanggan = useCallback(
    async (
      payload: RegisterCustomerPayload
    ): Promise<{ success: boolean; targetScreen?: ScreenName; message?: string }> => {
      setAuthError(null);
      setIsLoading(true);
      try {
        const result = await authService.registerCustomer(payload);
        if (!result.success || !result.data) {
          const msg = result.message || 'Gagal membuat akun pengguna.';
          setAuthError(msg);
          return { success: false, message: msg };
        }

        setToken(result.data.token);
        setUser(result.data.user);
        return {
          success: true,
          targetScreen: 'Home',
          message: result.message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Operasi Registrasi Pemberi Jasa (UC12 Skenario Pemberi Jasa & UC01 -> menuju UI-12)
   */
  const registerPemberiJasa = useCallback(
    async (
      payload: RegisterProviderPayload
    ): Promise<{ success: boolean; targetScreen?: ScreenName; message?: string }> => {
      setAuthError(null);
      setIsLoading(true);
      try {
        const result = await authService.registerProvider(payload);
        if (!result.success || !result.data) {
          const msg = result.message || 'Gagal mendaftarkan akun penyedia jasa.';
          setAuthError(msg);
          return { success: false, message: msg };
        }

        setToken(result.data.token);
        setUser(result.data.user);
        return {
          success: true,
          targetScreen: 'ProviderHistory',
          message: result.message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Pembaruan Profil Pengguna (UI-14)
   */
  const updateUserProfile = useCallback(
    async (
      payload: UpdateProfilePayload
    ): Promise<{ success: boolean; message: string }> => {
      if (!user) {
        return { success: false, message: 'Sesi pengguna tidak ditemukan.' };
      }

      const nameCheck = validateRequiredName(payload.namaPengguna);
      if (!nameCheck.isValid) {
        return {
          success: false,
          message: nameCheck.errorMessage || 'Nama lengkap wajib diisi.',
        };
      }

      const emailCheck = validateEmailInstant(payload.email, false);
      if (!emailCheck.isValid) {
        return {
          success: false,
          message: emailCheck.errorMessage || 'Format alamat email tidak valid.',
        };
      }

      if (payload.password && payload.password.trim().length > 0) {
        const passCheck = validatePasswordInstant(payload.password);
        if (!passCheck.isValid) {
          return {
            success: false,
            message:
              passCheck.errorMessage ||
              'Password harus memiliki panjang minimal 8 karakter.',
          };
        }
      }

      setIsLoading(true);
      try {
        const result = await authService.updateProfile(user, payload);
        if (result.success && result.data) {
          setUser(result.data);
        }
        return {
          success: result.success,
          message: result.message,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [user, validateRequiredName, validateEmailInstant, validatePasswordInstant]
  );

  /**
   * Keluar Akun (UI-14-09): membersihkan state sesi dan mengembalikan target UI-01 ('Login')
   */
  const logoutSession = useCallback((): ScreenName => {
    authService.logout();
    setUser(null);
    setToken(null);
    setAuthError(null);
    return 'Login';
  }, []);

  return (
    <AuthControllerContext.Provider
      value={{
        user,
        token,
        isLoading,
        authError,
        clearAuthError,
        validateEmailInstant,
        validatePasswordInstant,
        validateConfirmPasswordInstant,
        validateRequiredName,
        validasiInfoRegistrasi,
        triggerQueryLogin,
        registerPelanggan,
        registerPemberiJasa,
        updateUserProfile,
        logoutSession,
        getRoleTargetScreen,
      }}
    >
      {children}
    </AuthControllerContext.Provider>
  );
};

export const useAuthController = (): AuthControllerContextValue => {
  const context = useContext(AuthControllerContext);
  if (!context) {
    throw new Error(
      'useAuthController harus digunakan di dalam AuthControllerProvider'
    );
  }
  return context;
};
