import { NavigatorScreenParams } from '@react-navigation/native';

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
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
