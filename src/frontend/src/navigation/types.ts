export type UserRole = 'PELANGGAN' | 'PEMBERI_JASA' | 'LAYANAN_PELANGGAN';

export interface UserProfile {
  idPengguna: string;
  namaPengguna: string;
  username: string;
  email: string;
  nomorTelpon: string;
  nomorTelepon?: string;
  role: UserRole;
  avatarUrl: string | null;
  akumulasiRating?: number;
  riwayatRating?: number[];
  pemberiJasa?: {
    idPemberiJasa: string;
    namaToko: string;
    idKategoriJasa: string | null;
    jenisJasa: string | null;
    latitude?: number | null;
    longitude?: number | null;
    statusKetersediaan?: string;
    isOnline?: boolean;
  };
  layananPelanggan?: {
    idLayananPelanggan: string;
    status: string;
    jumlahTiketDipegang: number;
  };
}

export interface PendingProviderRegistration {
  namaPengguna: string;
  email: string;
  password: string;
  username?: string;
  nomorTelpon?: string;
}

export type ScreenName =
  | 'Login' // UI-01
  | 'RegisterCustomer' // UI-02
  | 'RegisterProvider' // UI-03
  | 'Home' // UI-04 (MainTabNavigator)
  | 'ServiceRegistration' // UI-16 (Daftar Penyedia Jasa)
  | 'ProviderHistory' // UI-12 (Riwayat Pekerjaan Penyedia Jasa)
  | 'CSHome' // UI-17 (Beranda CS)
  | 'Profile' // UI-14 (Profil Saya)
  | 'CustomerHistory' // UI-10 (Riwayat Pelanggan)
  | 'ConversationList'; // UI-07 (Daftar Pesan)

export type MainTabName = 'HomeTab' | 'HistoryTab' | 'ChatTab';

export interface NavigationContextValue {
  currentScreen: ScreenName;
  activeTab: MainTabName;
  pendingProviderData: PendingProviderRegistration | null;
  navigate: (screen: ScreenName, params?: { pendingProvider?: PendingProviderRegistration }) => void;
  goBack: () => void;
  setActiveTab: (tab: MainTabName) => void;
  resetToScreen: (screen: ScreenName) => void;
}
