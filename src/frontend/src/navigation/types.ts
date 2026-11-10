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
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}