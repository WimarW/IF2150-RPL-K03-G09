import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAuthController } from '../../controllers/useAuthController';
import { ScreenName } from '../../navigation/types';

export interface ProviderHistoryViewProps {
  onNavigate: (screen: ScreenName) => void;
}

const SAMPLE_JOBS = [
  {
    id: 'job-1',
    title: 'Bersih-bersih Rumah · 2 Jam',
    date: '12 Mei 2026 · 14.20',
    customerName: 'Naufal Hasbialhaq',
    price: 'Rp 100.000',
    status: 'Selesai',
    rating: '★ 5.0',
  },
  {
    id: 'job-2',
    title: 'Perbaikan Keran Air Bocor',
    date: '13 Mei 2026 · 09.30',
    customerName: 'Siti Rahayu',
    price: 'Rp 85.000',
    status: 'On Progress',
    rating: 'Menunggu Konfirmasi',
  },
];

/**
 * UI-12: Layar Riwayat Pekerjaan (Penyedia Jasa)
 * Realisasi Kelas DPPL: C05 PemberiJasaUI
 */
export const ProviderHistoryView: React.FC<ProviderHistoryViewProps> = ({
  onNavigate,
}) => {
  const { user } = useAuthController();
  const [activeFilter, setActiveFilter] = useState<
    'Semua' | 'Selesai' | 'On Progress'
  >('Semua');

  const filteredJobs = SAMPLE_JOBS.filter((job) =>
    activeFilter === 'Semua' ? true : job.status === activeFilter
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title} testID="provider-history-title">
            Riwayat Pekerjaan
          </Text>
          <Text style={styles.subtitle}>
            Daftar pekerjaan yang telah kamu selesaikan
          </Text>
          {user?.pemberiJasa?.namaToko ? (
            <Text style={styles.storeTag}>
              🏪 {user.pemberiJasa.namaToko} ({user.pemberiJasa.jenisJasa || 'Jasa'})
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          testID="provider-profile-button"
          style={styles.profileBadgeBtn}
          onPress={() => onNavigate('Profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.profileBadgeText}>Profil</Text>
        </TouchableOpacity>
      </View>

      {/* UI-12-03: Chip Filter Semua, Selesai, On Progress */}
      <View style={styles.filterRow}>
        {(['Semua', 'Selesai', 'On Progress'] as const).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* UI-12-04 s.d. UI-12-07: Kartu Pekerjaan Penyedia Jasa */}
      {filteredJobs.map((job) => {
        const isDone = job.status === 'Selesai';
        return (
          <View key={job.id} style={styles.jobCard}>
            <View style={styles.jobCardTop}>
              <View>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobDate}>{job.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  isDone ? styles.statusDone : styles.statusProgress,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    isDone ? styles.statusDoneText : styles.statusProgressText,
                  ]}
                >
                  {job.status}
                </Text>
              </View>
            </View>

            <Text style={styles.customerLabel}>
              Pelanggan: <Text style={styles.customerName}>{job.customerName}</Text>
            </Text>

            <View style={styles.jobCardFooter}>
              <Text style={styles.priceText}>{job.price}</Text>
              <Text style={styles.ratingOrConfirmText}>{job.rating}</Text>
            </View>
          </View>
        );
      })}
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
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  titleBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#13334C',
  },
  subtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 4,
  },
  storeTag: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F8A75',
    marginTop: 6,
  },
  profileBadgeBtn: {
    backgroundColor: '#DDF3EE',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#14967F',
  },
  profileBadgeText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#13334C',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  filterChip: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterChipActive: {
    backgroundColor: '#13334C',
    borderColor: '#13334C',
  },
  filterChipText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  jobCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#13334C',
  },
  jobDate: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  statusDone: {
    backgroundColor: '#DCFCE7',
  },
  statusProgress: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusDoneText: {
    color: '#166534',
  },
  statusProgressText: {
    color: '#92400E',
  },
  customerLabel: {
    fontSize: 13.5,
    color: '#64748B',
    marginBottom: 10,
  },
  customerName: {
    fontWeight: '700',
    color: '#13334C',
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F8A75',
  },
  ratingOrConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59E0B',
  },
});

export default ProviderHistoryView;
