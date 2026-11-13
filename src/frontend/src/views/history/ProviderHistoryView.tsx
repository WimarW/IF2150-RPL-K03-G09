/**
 * UI-12 Riwayat Pekerjaan Penyedia Jasa — Kelas DPPL C05 PemberiJasaUI & C08 PemberiJasaController
 * Traceability:
 * - Tabel 6.12 DPPL (UI-12-01 s.d. UI-12-07)
 * - UC01 (Tujuan pengalihan setelah pendaftaran penyedia jasa berhasil)
 * - UC04 & UC06 (Pelaporan pekerjaan telah selesai oleh penyedia jasa -> mengubah status dari 'On Progress' ke 'Menunggu Konfirmasi Pelanggan')
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import { HistoryFilterTab, ProviderJobItem } from '../../types/chat';
import {
  contractService,
  getCachedProviderHistory,
  resetMockContracts,
  subscribeContracts,
} from '../../services/contractService';
import {
  filterProviderJobsByTab,
  shouldShowMenungguKonfirmasiLabel,
  shouldShowPekerjaanSelesaiButton,
} from '../../controllers/useContractController';

export const INITIAL_PROVIDER_JOBS: ProviderJobItem[] =
  getCachedProviderHistory();

export function resetProviderJobs(): void {
  resetMockContracts();
}

function formatRupiah(amount: number): string {
  const formatted = Math.max(0, Math.round(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

function getCustomerAvatarBackground(
  initials: string,
  statusPekerjaan: string
): string {
  if (statusPekerjaan === 'Menunggu Konfirmasi Pelanggan' || initials === 'AP') {
    return '#FDF1DC';
  }
  if (initials === 'SR') {
    return '#DCF4ED';
  }
  return '#E8EEF5';
}

const FILTER_TABS: HistoryFilterTab[] = ['Semua', 'Selesai', 'On Progress'];

export interface ProviderHistoryViewProps {
  initialJobs?: ProviderJobItem[];
  onBackPress?: () => void;
}

export const ProviderHistoryView: React.FC<ProviderHistoryViewProps> = ({
  initialJobs,
  onBackPress,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [activeTab, setActiveTab] = useState<HistoryFilterTab>('Semua');
  const [jobs, setJobs] = useState<ProviderJobItem[]>(
    () => initialJobs ?? getCachedProviderHistory()
  );
  const [selectedJob, setSelectedJob] = useState<ProviderJobItem | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const syncJobs = useCallback(() => {
    if (initialJobs) return;
    setJobs(getCachedProviderHistory());
  }, [initialJobs]);

  useEffect(() => {
    if (initialJobs) {
      setJobs(initialJobs);
      return;
    }
    syncJobs();
    const unsubscribe = subscribeContracts(() => {
      syncJobs();
    });
    return unsubscribe;
  }, [initialJobs, syncJobs]);

  useFocusEffect(
    useCallback(() => {
      if (!initialJobs) {
        syncJobs();
        void contractService.fetchContractHistory().then(() => {
          syncJobs();
        });
      }
    }, [initialJobs, syncJobs])
  );

  const filteredJobs = useMemo(
    () => filterProviderJobsByTab(jobs, activeTab),
    [jobs, activeTab]
  );

  /**
   * UI-12-01: Tombol "‹ Kembali" untuk kembali ke layar sebelumnya atau Beranda.
   */
  const handleBack = useCallback(() => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    if (typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Main', { screen: 'Beranda' });
  }, [navigation, onBackPress]);

  /**
   * UC06 (UI-12-07 | Kelas DPPL C05 PemberiJasaUI.onClickSelesai & C08 PemberiJasaController.selesaikanPekerjaan):
   * Mengubah status pekerjaan dari 'On Progress' menjadi 'Menunggu Konfirmasi Pelanggan'
   * dan mengirim notifikasi ke pelanggan melalui PATCH /api/kontrak/:id/selesai.
   */
  const handleCompleteWork = useCallback(
    async (item: ProviderJobItem) => {
      if (submittingId) return;
      setSubmittingId(item.idKontrak);
      try {
        await contractService.completeWorkByProvider(item.idKontrak);

        if (initialJobs) {
          setJobs((prev) =>
            prev.map((job) =>
              job.idKontrak === item.idKontrak
                ? {
                    ...job,
                    statusPekerjaan: 'Menunggu Konfirmasi Pelanggan',
                    statusDisplay: 'On Progress',
                  }
                : job
            )
          );
        } else {
          syncJobs();
        }

        setSelectedJob((prev) =>
          prev && prev.idKontrak === item.idKontrak
            ? {
                ...prev,
                statusPekerjaan: 'Menunggu Konfirmasi Pelanggan',
                statusDisplay: 'On Progress',
              }
            : prev
        );

        setBannerMessage(
          'Pekerjaan telah dilaporkan selesai. Menunggu konfirmasi dari pelanggan.'
        );
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal melaporkan penyelesaian pekerjaan.';
        setBannerMessage(msg);
      } finally {
        setSubmittingId(null);
      }
    },
    [initialJobs, submittingId, syncJobs]
  );

  const renderBadge = (item: ProviderJobItem) => {
    if (item.statusDisplay === 'Selesai') {
      return (
        <View
          style={[styles.badge, styles.badgeSelesai]}
          testID={`UI-12-05-badge-${item.idKontrak}`}
        >
          <Text style={[styles.badgeText, styles.badgeTextSelesai]}>
            Selesai
          </Text>
        </View>
      );
    }

    if (item.statusDisplay === 'Dibatalkan') {
      return (
        <View
          style={[styles.badge, styles.badgeDibatalkan]}
          testID={`UI-12-05-badge-${item.idKontrak}`}
        >
          <Text style={[styles.badgeText, styles.badgeTextDibatalkan]}>
            Dibatalkan
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[styles.badge, styles.badgeOnProgress]}
        testID={`UI-12-05-badge-${item.idKontrak}`}
      >
        <Text style={[styles.badgeText, styles.badgeTextOnProgress]}>
          On Progress
        </Text>
      </View>
    );
  };

  const renderCard = ({ item }: { item: ProviderJobItem }) => {
    const showCompleteButton = shouldShowPekerjaanSelesaiButton(
      item.statusPekerjaan
    );
    const showWaitingLabel = shouldShowMenungguKonfirmasiLabel(
      item.statusPekerjaan
    );
    const isCompleted = item.statusDisplay === 'Selesai';
    const isSubmitting = submittingId === item.idKontrak;
    const avatarBg = getCustomerAvatarBackground(
      item.inisialPelanggan,
      item.statusPekerjaan
    );

    return (
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => setSelectedJob(item)}
        style={styles.card}
        testID={`UI-12-04-card-${item.idKontrak}`}
      >
        {/* Bagian atas kartu: Rincian Pekerjaan, Tanggal/Waktu, & Badge Status (UI-12-04 & UI-12-05) */}
        <View style={styles.cardTopRow}>
          <View style={styles.cardTitleBlock}>
            <Text style={styles.cardTitle}>{item.rincianPekerjaan}</Text>
            <Text style={styles.cardDate}>{item.tanggalWaktu}</Text>
          </View>
          {renderBadge(item)}
        </View>

        <View style={styles.dashedDivider} />

        {/* Bagian bawah kartu: Info Pelanggan & Harga / Rating / Status Menunggu Konfirmasi (UI-12-04, UI-12-06, UI-12-07) */}
        <View style={styles.customerRow}>
          <View style={styles.customerInfo}>
            <View
              style={[styles.avatarSquare, { backgroundColor: avatarBg }]}
            >
              <Text style={styles.avatarInitials}>{item.inisialPelanggan}</Text>
            </View>
            <View>
              <Text style={styles.customerName}>{item.namaPelanggan}</Text>
              <Text style={styles.customerRoleLabel}>Pelanggan</Text>
            </View>
          </View>

          {showWaitingLabel ? (
            <View
              style={styles.waitingConfirmationRight}
              testID={`UI-12-07-waiting-${item.idKontrak}`}
            >
              <Text style={styles.waitingMainText}>Menunggu</Text>
              <Text style={styles.waitingSubText}>Konfirmasi</Text>
            </View>
          ) : (
            <View style={styles.priceRatingRight}>
              <Text
                style={styles.priceText}
                testID={`UI-12-06-price-${item.idKontrak}`}
              >
                {formatRupiah(item.totalHarga)}
              </Text>
              {isCompleted && typeof item.nilaiRating === 'number' && (
                <Text
                  style={styles.ratingStarText}
                  testID={`UI-12-06-rating-${item.idKontrak}`}
                >
                  ★ {item.nilaiRating.toFixed(1)}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* UC06 (UI-12-07): Tombol "Pekerjaan Telah Selesai" untuk mengubah status dari On Progress ke Menunggu Konfirmasi Pelanggan */}
        {showCompleteButton && (
          <View style={styles.completeActionRow}>
            <TouchableOpacity
              style={[
                styles.completeWorkButton,
                isSubmitting && styles.buttonDisabled,
              ]}
              onPress={() => handleCompleteWork(item)}
              disabled={isSubmitting}
              testID={`UI-12-07-complete-btn-${item.idKontrak}`}
              accessibilityRole="button"
              accessibilityLabel={`Pekerjaan telah selesai ${item.rincianPekerjaan}`}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.completeWorkButtonText}>
                  Pekerjaan Telah Selesai
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container} testID="ui12-provider-history">
        {/* UI-12-01 Tombol Kembali */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          testID="UI-12-01-back-button"
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <Ionicons name="chevron-back" size={22} color="#153B65" />
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>

        {/* UI-12-02 Header "Riwayat Pekerjaan" */}
        <View style={styles.headerBlock} testID="UI-12-02-header">
          <Text style={styles.headerTitle}>Riwayat Pekerjaan</Text>
          <Text style={styles.headerSubtitle}>
            Daftar pekerjaan yang telah kamu selesaikan
          </Text>
        </View>

        {bannerMessage && (
          <View style={styles.infoBanner} testID="UI-12-status-banner">
            <Text style={styles.infoBannerText}>{bannerMessage}</Text>
            <TouchableOpacity
              onPress={() => setBannerMessage(null)}
              accessibilityRole="button"
              accessibilityLabel="Tutup pesan"
            >
              <Text style={styles.infoBannerDismiss}>Tutup</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* UI-12-03 Chip Filter Status */}
        <View style={styles.filterRow} testID="UI-12-03-filter-row">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveTab(tab)}
                testID={`UI-12-03-filter-${tab}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* UI-12-04 Daftar Kartu Pekerjaan */}
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.idKontrak}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          testID="UI-12-04-job-list"
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Belum Ada Riwayat Pekerjaan</Text>
              <Text style={styles.emptyDesc}>
                Tidak ada pekerjaan untuk filter {activeTab}.
              </Text>
            </View>
          }
        />

        {/* Modal Detail Pekerjaan (KontrakPekerjaanUI.showDetailPekerjaan & UI-12-07) */}
        <Modal
          visible={selectedJob !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedJob(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard} testID="UI-12-detail-modal">
              <Text style={styles.modalTitle}>Detail Pekerjaan</Text>
              {selectedJob && (
                <>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Rincian Pekerjaan</Text>
                    <Text style={styles.modalValue}>
                      {selectedJob.rincianPekerjaan}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Pelanggan</Text>
                    <Text style={styles.modalValue}>
                      {selectedJob.namaPelanggan}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Waktu</Text>
                    <Text style={styles.modalValue}>
                      {selectedJob.tanggalWaktu}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Status</Text>
                    <Text style={styles.modalValue}>
                      {selectedJob.statusPekerjaan ===
                      'Menunggu Konfirmasi Pelanggan'
                        ? 'Menunggu Konfirmasi Pelanggan'
                        : selectedJob.statusDisplay}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Harga Persetujuan</Text>
                    <Text style={styles.modalValue}>
                      {formatRupiah(selectedJob.totalHarga)}
                    </Text>
                  </View>
                  {selectedJob.statusDisplay === 'Selesai' &&
                    typeof selectedJob.nilaiRating === 'number' && (
                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Rating Pelanggan</Text>
                        <Text style={styles.modalRatingValue}>
                          ★ {selectedJob.nilaiRating.toFixed(1)}
                        </Text>
                      </View>
                    )}

                  {shouldShowPekerjaanSelesaiButton(
                    selectedJob.statusPekerjaan
                  ) && (
                    <TouchableOpacity
                      style={[
                        styles.modalCompleteBtn,
                        submittingId === selectedJob.idKontrak &&
                          styles.buttonDisabled,
                      ]}
                      onPress={() => handleCompleteWork(selectedJob)}
                      disabled={submittingId === selectedJob.idKontrak}
                      testID="UI-12-modal-complete-btn"
                    >
                      <Text style={styles.modalCompleteBtnText}>
                        Pekerjaan Telah Selesai
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedJob(null)}
                testID="UI-12-close-detail"
              >
                <Text style={styles.modalCloseText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
    marginLeft: -4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153B65',
  },
  headerBlock: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#153B65',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6E8299',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F7F4',
    borderColor: '#99E2D0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0B6E53',
  },
  infoBannerDismiss: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B8F6A',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  filterChip: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#DCE4ED',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: '#153B65',
    borderColor: '#153B65',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6E8299',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 28,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E9F1',
    padding: 18,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#153B65',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E8299',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeSelesai: {
    backgroundColor: '#DCF4ED',
  },
  badgeTextSelesai: {
    color: '#0B9F77',
  },
  badgeOnProgress: {
    backgroundColor: '#FDF1DC',
  },
  badgeTextOnProgress: {
    color: '#B25E00',
  },
  badgeDibatalkan: {
    backgroundColor: '#FDE8E8',
  },
  badgeTextDibatalkan: {
    color: '#D92D20',
  },
  dashedDivider: {
    height: 1,
    borderWidth: 0.6,
    borderColor: '#E3EAF2',
    borderStyle: 'dashed',
    marginVertical: 14,
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarSquare: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 13,
    fontWeight: '800',
    color: '#153B65',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#153B65',
    marginBottom: 2,
  },
  customerRoleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7A8EA4',
  },
  priceRatingRight: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B9F77',
  },
  ratingStarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EE9B3A',
    marginTop: 2,
  },
  waitingConfirmationRight: {
    alignItems: 'flex-end',
  },
  waitingMainText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#6E8299',
  },
  waitingSubText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6E8299',
  },
  completeActionRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  completeWorkButton: {
    backgroundColor: '#153B65',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeWorkButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153B65',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#6E8299',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#153B65',
    marginBottom: 14,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  modalLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  modalValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#153B65',
    textAlign: 'right',
    flexShrink: 1,
  },
  modalRatingValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EE9B3A',
  },
  modalCompleteBtn: {
    marginTop: 16,
    backgroundColor: '#0B9F77',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCompleteBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalCloseBtn: {
    marginTop: 10,
    backgroundColor: '#153B65',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ProviderHistoryView;
