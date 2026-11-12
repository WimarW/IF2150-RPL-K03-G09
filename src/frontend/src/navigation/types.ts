import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type UserRole = 'PELANGGAN' | 'PEMBERI_JASA' | 'LAYANAN_PELANGGAN';

export interface UserProfile {
  idPengguna: string;
  namaPengguna: string;
  username: string;
  email: string;
  nomorTelpon?: string;
  nomorTelepon?: string;
  role: UserRole;
  avatarUrl?: string | null;
  akumulasiRating?: number;
  riwayatRating?: number[];
  pemberiJasa?: {
    idPemberiJasa: string;
    namaToko: string;
    idKategoriJasa: string;
    jenisJasa: string;
    statusKetersediaan: string;
    isOnline: boolean;
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
}

/**
 * Daftar layar navigasi utama terkait fitur Autentikasi & Profil:
 * - UI-01: Login
 * - UI-02: RegisterCustomer (Buat Akun Pengguna)
 * - UI-03: RegisterProvider (Buat Akun Jasa)
 * - UI-04: Home (Beranda Pelanggan)
 * - UI-12: ProviderHistory (Riwayat Pesanan Pemberi Jasa / Beranda Penyedia Jasa)
 * - UI-14: Profile (Profil Saya)
 * - UI-16: ServiceRegistration (Alur Verifikasi / Pendaftaran Jasa Penyedia Jasa)
 * - UI-17: CSHome (Beranda Layanan Pelanggan)
 */
export type ScreenName =
  | 'Login'
  | 'RegisterCustomer'
  | 'RegisterProvider'
  | 'ServiceRegistration'
  | 'Home'
  | 'ProviderHistory'
  | 'CSHome'
  | 'Chat'
  | 'Profile';

export type MainTabName = 'HomeTab' | 'HistoryTab' | 'ChatTab';

export type RootTabParamList = {
  Beranda: undefined;
  Riwayat: undefined;
  Chat: undefined;
};

export interface ChatRouteParams {
  conversationId?: string;
  partnerId?: string;
  partnerName?: string;
  idPemberiJasa?: string;
  namaPemberiJasa?: string;
  namaToko?: string;
  jenisJasa?: string;
  isCS?: boolean;
  isOnline?: boolean;
}

export type RootStackParamList = {
  Login: undefined;
  RegisterCustomer: undefined;
  RegisterProvider: undefined;
  Main: NavigatorScreenParams<RootTabParamList> | undefined;
  CreateTicket: { orderId?: string } | undefined;
  MyTickets: undefined;
  TicketDetail: { ticketId: string };
  CSDashboard: undefined;
  CSHome: undefined;
  ServiceRegistration:
    | { pendingProvider?: PendingProviderRegistration }
    | undefined;
  ProviderHistory: undefined;
  SearchRecommendation:
    | {
        initialQuery?: string;
        initialCategoryId?: string;
        initialCategoryName?: string;
      }
    | undefined;
  SearchResult:
    | {
        keyword?: string;
        kategori?: string;
        initialSort?: 'terdekat' | 'rating_terbaik' | 'harga_termurah';
        focusProviderId?: string;
        query?: string;
        categoryId?: string;
        categoryName?: string;
        idKategori?: string;
        namaKategori?: string;
      }
    | undefined;
  CustomerChat: ChatRouteParams | undefined;
  ProviderChat: ChatRouteParams | undefined;
  Notification: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
