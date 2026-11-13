import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SortKey } from '../services/serviceCatalogService';

export type RootTabParamList = {
  Beranda: undefined;
  Riwayat: undefined;
  Chat: undefined;
};

export type RootStackParamList = {
  Main: NavigatorScreenParams<RootTabParamList> | undefined;
  // Tiket laporan & Layanan Pelanggan (UC08, UC09)
  CreateTicket: undefined;
  MyTickets: undefined;
  TicketDetail: { ticketId: string };
  CSDashboard: undefined;
  // Katalog, Pencarian, Chat & Notifikasi
  ServiceRegistration: undefined;
  SearchRecommendation: { initialQuery?: string } | undefined;
  SearchResult: {
    keyword: string;
    kategori?: string;
    initialSort?: SortKey;
    focusProviderId?: string;
  };
  CustomerChat: {
    idPemberiJasa: string;
    namaPemberiJasa: string;
    isOnline?: boolean;
    partnerId?: string;
    partnerName?: string;
    isCS?: boolean;
  };
  ProviderChat: {
    partnerId: string;
    partnerName: string;
    isCS?: boolean;
    isOnline?: boolean;
  };
  // Didaftarkan oleh branch UI-13 / UI-14
  Notification: undefined; // UI-13 (Vinsensius)
  Profile: undefined; // UI-14 (Wimar)
  // UI-11 Beri Rating (UC10)
  Rating: {
    idKontrak: string;
    idPemberiJasa: string;
    namaPemberiJasa: string;
    kategoriJasa?: string;
    rincianPekerjaan: string;
    tanggalSelesai: string;
    biayaLayanan: number;
    inisialPemberiJasa?: string;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}