import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ScreenName } from '../../navigation/types';

export interface CSHomeViewProps {
  onNavigate: (screen: ScreenName) => void;
}

const RECENT_TICKETS = [
  {
    id: '#A-2041',
    title: 'Laporan Pembayaran',
    reporter: 'Naufal Hasbialhaq',
    time: '14.20',
    status: 'Tiket Baru',
  },
  {
    id: '#A-2040',
    title: 'Kendala Aplikasi',
    reporter: 'Budi Wijaya',
    time: '12.05',
    status: 'Diproses',
  },
];

/**
 * UI-17: Layar Beranda CS (Layanan Pelanggan)
 * Realisasi Kelas DPPL: C11 LayananPelangganUI
 */
export const CSHomeView: React.FC<CSHomeViewProps> = ({ onNavigate }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* UI-17-01 & UI-17-02: Judul Beranda CS & Avatar CS */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title} testID="cs-home-title">
            Beranda CS
          </Text>
          <Text style={styles.subtitle}>Pusat Bantuan & Laporan</Text>
        </View>

        <TouchableOpacity
          testID="cs-profile-avatar-button"
          style={styles.csAvatarBtn}
          onPress={() => onNavigate('Profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.csAvatarText}>CS</Text>
        </TouchableOpacity>
      </View>

      {/* UI-17-03, UI-17-04, UI-17-05: Kartu Statistik Tiket */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#EA580C' }]}>12</Text>
          <Text style={styles.statLabel}>Tiket Baru</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#0F8A75' }]}>5</Text>
          <Text style={styles.statLabel}>Diproses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#13334C' }]}>28</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </View>
      </View>

      {/* UI-17-06 & UI-17-07: Tiket Terbaru */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tiket Terbaru</Text>
        <Text style={styles.sectionLink}>Lihat semua</Text>
      </View>

      {RECENT_TICKETS.map((ticket) => (
        <View key={ticket.id} style={styles.ticketCard}>
          <View style={styles.ticketTop}>
            <Text style={styles.ticketTitle}>
              {ticket.title} {ticket.id}
            </Text>
            <Text style={styles.ticketStatus}>{ticket.status}</Text>
          </View>
          <Text style={styles.ticketMeta}>
            Pelapor: {ticket.reporter} · {ticket.time}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F8',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 44,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#13334C',
  },
  subtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 2,
  },
  csAvatarBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#13334C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  csAvatarText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#13334C',
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F8A75',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ticketTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#13334C',
  },
  ticketStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EA580C',
  },
  ticketMeta: {
    fontSize: 13,
    color: '#64748B',
  },
});

export default CSHomeView;
