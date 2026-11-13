/**
 * UI-10 Riwayat Pelanggan — Kelas DPPL C02 PenggunaUI & C17 KontrakPekerjaanUI
 * Traceability:
 * - Tabel 6.10 DPPL (UI-10-01 s.d. UI-10-06)
 * - UC07 (Pelanggan mengonfirmasi penyelesaian pekerjaan dan pembayaran -> Tombol "Konfirmasi Selesai")
 * - UC10 (Pelanggan memberikan rating dan ulasan -> Tombol "Beri Rating" & Modal UI-11)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSessionUser } from '../../services/api';
import {
  CustomerTransactionItem,
  HistoryDisplayStatus,
  HistoryFilterTab,
  confirmContractCompletion,
  fetchCustomerTransactions,
  getCustomerTransactionsSnapshot,
  getLastBackendSyncStatus,
  subscribeCustomerTransactions,
} from '../../services/ratingService';
import {
  contractService,
  subscribeContracts,
} from '../../services/contractService';
import {
  filterTransactionsByTab,
  shouldShowBeriRatingButton,
} from '../../controllers/useRatingController';
import { RatingModal } from '../rating/RatingView';

const FILTER_TABS: HistoryFilterTab[] = ['Semua', 'Selesai', 'On Progress'];

interface StatusBadgeTheme {
  backgroundColor: string;
  dotColor: string;
  textColor: string;
}

function getStatusBadgeTheme(status: HistoryDisplayStatus): StatusBadgeTheme {
  switch (status) {
    case 'On Progress':
      return {
        backgroundColor: '#FFF0DC',
        dotColor: '#C47A00',
        textColor: '#C47A00',
      };
    case 'Selesai':
      return {
        backgroundColor: '#DDF5EE',
        dotColor: '#078875',
        textColor: '#078875',
      };
    case 'Dibatalkan':
      return {
        backgroundColor: '#FBE7E7',
        dotColor: '#C93636',
        textColor: '#C93636',
      };
  }
}

/**
 * Layar Riwayat Transaksi Pelanggan (`UI-10` / Kelas DPPL `C02 PenggunaUI`).
 * Mendukung:
 * - UC07: Tombol "Konfirmasi Selesai" pada pesanan yang dilaporkan selesai oleh penyedia jasa.
 * - Skenario Normal `UC10`: Konfirmasi pesanan selesai otomatis memunculkan dialog Beri Penilaian (`UI-11`).
 * - Skenario Alternatif 1 `UC10`: Jika dialog ditutup (`‹ Kembali`), tombol "Beri Rating" (`UI-10-06`)
 *   tetap tersedia di kartu riwayat dan dapat dibuka kapan saja.
 * - Penyembunyian tombol "Beri Rating" seketika setelah penilaian berhasil dikirim (`hasRating = true`).
 */
export const CustomerHistoryView: React.FC = () => {
  const { user } = useSessionUser();
  const [transactions, setTransactions] = useState<CustomerTransactionItem[]>(
    () => getCustomerTransactionsSnapshot()
  );
  const [activeFilter, setActiveFilter] = useState<HistoryFilterTab>('Semua');
  const [ratingTarget, setRatingTarget] =
    useState<CustomerTransactionItem | null>(null);
  const [detailTarget, setDetailTarget] =
    useState<CustomerTransactionItem | null>(null);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);

  const loadFromBackend = useCallback(async () => {
    setIsRefreshing(true);
    await fetchCustomerTransactions();
    const syncStatus = getLastBackendSyncStatus();
    if (syncStatus.source === 'offline' && syncStatus.error) {
      setSyncWarning(
        `Mode offline (${syncStatus.apiBaseUrl}): ${syncStatus.error}`
      );
    } else {
      setSyncWarning(null);
    }
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribeRating = subscribeCustomerTransactions((updatedItems) => {
      setTransactions(updatedItems);
    });
    const unsubscribeContracts = subscribeContracts(() => {
      setTransactions(getCustomerTransactionsSnapshot());
    });
    loadFromBackend();
    return () => {
      unsubscribeRating();
      unsubscribeContracts();
    };
  }, [loadFromBackend]);

  const filteredTransactions = useMemo(
    () => filterTransactionsByTab(transactions, activeFilter),
    [transactions, activeFilter]
  );

  /**
   * Membuka form/modal Beri Penilaian (`UI-11`) dari tombol "Beri Rating" (`UI-10-06`)
   * sesuai Skenario Alternatif 1 `UC10`.
   */
  const handleOpenRatingModal = useCallback((item: CustomerTransactionItem) => {
    setFeedbackBanner(null);
    setRatingTarget(item);
  }, []);

  /**
   * Menangani `UC07` (Konfirmasi Selesai oleh Pelanggan) & Skenario Normal `UC10`:
   * Saat pelanggan mengonfirmasi pekerjaan selesai (`Done`), status kontrak diperbarui
   * ke backend (`PATCH /api/kontrak/:id/konfirmasi`) maupun store penyedia jasa (`UI-12`),
   * lalu dialog popup Beri Penilaian (`UI-11`) langsung ditampilkan.
   */
  const handleConfirmOrderCompleted = useCallback(
    async (item: CustomerTransactionItem) => {
      const updated = await confirmContractCompletion(item.idKontrak);
      await contractService.confirmWorkByCustomer(item.idKontrak);
      if (updated) {
        setRatingTarget(updated);
      }
    },
    []
  );

  /**
   * Skenario Alternatif 1 `UC10`:
   * Menutup dialog Beri Penilaian tanpa menyimpan penilaian.
   * Kesempatan menilai tetap tersimpan karena `hasRating` bernilai `false`.
   */
  const handleCancelRatingModal = useCallback(() => {
    setRatingTarget(null);
  }, []);

  /**
   * Setelah submit berhasil (`201 Created`):
   * - Modal `UI-11` ditutup kembali ke layar Riwayat (`UI-10`)
   * - Status `hasRating` langsung `true` sehingga tombol "Beri Rating" (`UI-10-06`) seketika tersembunyi
   * - Menyinkronkan nilai rating ke store `contractService` (untuk tampilan `UI-12` Penyedia Jasa)
   * - Menampilkan feedback sukses kepada pengguna.
   */
  const handleRatingSubmitted = useCallback(
    (result: {
      idKontrakPekerjaan: string;
      nilaiRating: number;
      ulasan: string;
      tags: string[];
      message: string;
    }) => {
      contractService.markContractRated(
        result.idKontrakPekerjaan,
        result.nilaiRating,
        result.ulasan
      );
      setRatingTarget(null);
      setTransactions(getCustomerTransactionsSnapshot());
      setFeedbackBanner(
        `Penilaian ${result.nilaiRating} bintang berhasil dikirim. Terima kasih!`
      );
    },
    []
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={loadFromBackend}
          />
        }
      >
        {/* UI-10-01: Header Judul & Subjudul */}
        <View testID="UI-10-01-header" style={styles.headerSection}>
          <Text style={styles.headerTitle}>Riwayat</Text>
          <Text style={styles.headerSubtitle}>Semua transaksi jasamu</Text>
        </View>

        {/* UI-10-02: Filter Chip ("Semua", "Selesai", "On Progress") */}
        <View testID="UI-10-02-filter-row" style={styles.filterRow}>
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                testID={`UI-10-02-filter-${tab}`}
                style={[
                  styles.filterChip,
                  isActive
                    ? styles.filterChipActive
                    : styles.filterChipInactive,
                ]}
                onPress={() => setActiveFilter(tab)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive
                      ? styles.filterChipTextActive
                      : styles.filterChipTextInactive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Banner Peringatan Koneksi Backend (Jika offline / salah URL) */}
        {syncWarning ? (
          <View testID="UI-10-offline-warning" style={styles.warningBanner}>
            <Ionicons name="cloud-offline-outline" size={18} color="#C47A00" />
            <Text style={styles.warningBannerText}>{syncWarning}</Text>
          </View>
        ) : null}

        {/* Banner Feedback Sukses Penilaian */}
        {feedbackBanner ? (
          <View
            testID="UI-10-rating-success-banner"
            style={styles.successBanner}
          >
            <Ionicons name="checkmark-circle" size={18} color="#078875" />
            <Text style={styles.successBannerText}>{feedbackBanner}</Text>
            <TouchableOpacity
              onPress={() => setFeedbackBanner(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={16} color="#078875" />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* UI-10-03: Daftar Kartu Transaksi */}
        <View testID="UI-10-03-transaction-list" style={styles.cardList}>
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
              <Text style={styles.emptySubtitle}>
                Tidak ada riwayat transaksi untuk filter "{activeFilter}".
              </Text>
            </View>
          ) : (
            filteredTransactions.map((item) => {
              const badgeTheme = getStatusBadgeTheme(item.displayStatus);
              const showBeriRating = shouldShowBeriRatingButton(item);
              const isDone =
                item.statusPekerjaan === 'Done' ||
                item.displayStatus === 'Selesai';
              const isOnProgress = item.displayStatus === 'On Progress';
              const isReportedDoneByProvider =
                item.statusPekerjaan === 'Menunggu Konfirmasi Pelanggan';

              return (
                <View
                  key={item.idKontrak}
                  testID={`UI-10-03-card-${item.idKontrak}`}
                  style={styles.transactionCard}
                >
                  {/* Baris Atas: Judul Pekerjaan, Waktu, & UI-10-04 Status Badge */}
                  <View style={styles.cardTopRow}>
                    <View style={styles.cardTitleColumn}>
                      <Text style={styles.jobTitleText} numberOfLines={1}>
                        {item.judulPekerjaan}
                      </Text>
                      <Text style={styles.timestampText}>
                        {item.waktuTransaksi}
                      </Text>
                    </View>

                    {/* UI-10-04: Status Badge */}
                    <View
                      testID={`UI-10-04-badge-${item.idKontrak}`}
                      style={[
                        styles.statusBadge,
                        { backgroundColor: badgeTheme.backgroundColor },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: badgeTheme.dotColor },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: badgeTheme.textColor },
                        ]}
                      >
                        {item.displayStatus}
                      </Text>
                    </View>
                  </View>

                  {/* Garis Pemisah Putus-Putus */}
                  <View style={styles.dashedDivider} />

                  {/* Baris Penyedia Jasa & Total Harga */}
                  <View style={styles.providerPriceRow}>
                    <View style={styles.providerIdentityRow}>
                      <View style={styles.providerAvatar}>
                        <Text style={styles.providerAvatarText}>
                          {item.inisialPenyedia}
                        </Text>
                      </View>
                      <Text style={styles.providerNameText}>
                        {item.namaPenyedia}
                      </Text>
                    </View>

                    <Text style={styles.priceText}>{item.hargaFormatted}</Text>
                  </View>

                  {/* Indikator jika penyedia jasa telah melaporkan pekerjaan selesai (UC06 -> UC07) */}
                  {isReportedDoneByProvider ? (
                    <Text style={styles.reportedCompletedNote}>
                      Penyedia jasa telah melaporkan pekerjaan ini selesai
                    </Text>
                  ) : null}

                  {/* Baris Tombol Aksi untuk Pesanan Selesai (`UI-10-05` & `UI-10-06`) */}
                  {isDone ? (
                    <View style={styles.actionButtonsRow}>
                      {/* UI-10-05: Tombol "Lihat Detail" */}
                      <TouchableOpacity
                        testID={`UI-10-05-detail-${item.idKontrak}`}
                        style={[
                          styles.detailButton,
                          !showBeriRating && styles.detailButtonExpanded,
                        ]}
                        onPress={() => setDetailTarget(item)}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                      >
                        <Text style={styles.detailButtonText}>Lihat Detail</Text>
                      </TouchableOpacity>

                      {/* UI-10-06: Tombol "Beri Rating" (Hanya muncul jika belum dinilai) */}
                      {showBeriRating ? (
                        <TouchableOpacity
                          testID={`UI-10-06-rate-${item.idKontrak}`}
                          style={styles.rateButton}
                          onPress={() => handleOpenRatingModal(item)}
                          activeOpacity={0.85}
                          accessibilityRole="button"
                        >
                          <Text style={styles.rateButtonText}>Beri Rating</Text>
                        </TouchableOpacity>
                      ) : (
                        <View
                          testID={`UI-10-rated-indicator-${item.idKontrak}`}
                          style={styles.ratedBadgeBox}
                        >
                          <Ionicons name="star" size={14} color="#F4A340" />
                          <Text style={styles.ratedBadgeText}>
                            {item.nilaiRatingDiberikan
                              ? `${item.nilaiRatingDiberikan}/5 · Dinilai`
                              : 'Telah Dinilai'}
                          </Text>
                        </View>
                      )}
                    </View>
                  ) : null}

                  {/* Tombol Konfirmasi Pesanan Selesai (UC07 & Skenario Normal UC10) */}
                  {isOnProgress ? (
                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        testID={`UI-10-05-detail-${item.idKontrak}`}
                        style={styles.detailButton}
                        onPress={() => setDetailTarget(item)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.detailButtonText}>Lihat Detail</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        testID={`UI-10-confirm-complete-${item.idKontrak}`}
                        style={styles.confirmCompleteButton}
                        onPress={() => handleConfirmOrderCompleted(item)}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.confirmCompleteButtonText}>
                          Konfirmasi Selesai
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modal Layar Beri Penilaian (`UI-11`) untuk Skenario Normal & Alternatif 1 `UC10` */}
      {ratingTarget ? (
        <RatingModal
          visible={Boolean(ratingTarget)}
          idKontrakPekerjaan={ratingTarget.idKontrak}
          idPenggunaPemberi={
            ratingTarget.idPenggunaPelanggan || user.idPengguna
          }
          idPenggunaPenerima={ratingTarget.idPenggunaPenyedia}
          namaPenerima={ratingTarget.namaPenyedia}
          inisialPenerima={ratingTarget.inisialPenyedia}
          detailPekerjaan={ratingTarget.detailPekerjaan}
          onCancel={handleCancelRatingModal}
          onSuccess={handleRatingSubmitted}
        />
      ) : null}

      {/* Modal Ringkasan Detail Transaksi (`UI-10-05`) */}
      <Modal
        visible={Boolean(detailTarget)}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailTarget(null)}
      >
        <View style={styles.detailModalBackdrop}>
          <View style={styles.detailModalCard}>
            <Text style={styles.detailModalTitle}>Detail Transaksi</Text>
            {detailTarget ? (
              <>
                <View style={styles.detailItemRow}>
                  <Text style={styles.detailLabel}>Pekerjaan</Text>
                  <Text style={styles.detailValue}>
                    {detailTarget.detailPekerjaan}
                  </Text>
                </View>
                <View style={styles.detailItemRow}>
                  <Text style={styles.detailLabel}>Penyedia Jasa</Text>
                  <Text style={styles.detailValue}>
                    {detailTarget.namaPenyedia}
                  </Text>
                </View>
                <View style={styles.detailItemRow}>
                  <Text style={styles.detailLabel}>Waktu</Text>
                  <Text style={styles.detailValue}>
                    {detailTarget.waktuTransaksi}
                  </Text>
                </View>
                <View style={styles.detailItemRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={styles.detailValue}>
                    {detailTarget.statusPekerjaan ===
                    'Menunggu Konfirmasi Pelanggan'
                      ? 'Menunggu Konfirmasi Pelanggan'
                      : detailTarget.displayStatus}
                  </Text>
                </View>
                <View style={styles.detailItemRow}>
                  <Text style={styles.detailLabel}>Total Biaya</Text>
                  <Text style={styles.detailValue}>
                    {detailTarget.hargaFormatted}
                  </Text>
                </View>
                {detailTarget.hasRating ? (
                  <View style={styles.detailItemRow}>
                    <Text style={styles.detailLabel}>Penilaian Anda</Text>
                    <Text style={styles.detailValue}>
                      ★ {detailTarget.nilaiRatingDiberikan ?? 5}/5
                      {detailTarget.ulasanDiberikan
                        ? ` — "${detailTarget.ulasanDiberikan}"`
                        : ''}
                    </Text>
                  </View>
                ) : null}
              </>
            ) : null}

            <TouchableOpacity
              style={styles.detailCloseButton}
              onPress={() => setDetailTarget(null)}
            >
              <Text style={styles.detailCloseButtonText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerSection: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#153B65',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7A8FA8',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    height: 32,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#153B65',
  },
  filterChipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EDF2',
  },
  filterChipText: {
    fontSize: 12,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  filterChipTextInactive: {
    color: '#7A8FA8',
    fontWeight: '500',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDF5EE',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 16,
  },
  successBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#078875',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0DC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 16,
  },
  warningBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#C47A00',
  },
  cardList: {
    gap: 14,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5EDF2',
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  cardTitleColumn: {
    flex: 1,
  },
  jobTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#153B65',
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#7A8FA8',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderColor: '#E5EDF2',
    borderStyle: 'dashed',
    marginBottom: 14,
  },
  providerPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  providerIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  providerAvatar: {
    width: 35,
    height: 32,
    borderRadius: 11,
    backgroundColor: '#DDF5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#153B65',
  },
  providerNameText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#153B65',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#153B65',
  },
  reportedCompletedNote: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#C47A00',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  detailButton: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#CFDCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButtonExpanded: {
    flex: 1,
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#153B65',
  },
  rateButton: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F4A340',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#153B65',
  },
  ratedBadgeBox: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F7F9F8',
    borderWidth: 1,
    borderColor: '#E5EDF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  ratedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#153B65',
  },
  confirmCompleteButton: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#20AE9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCompleteButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5EDF2',
    padding: 28,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153B65',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#7A8FA8',
    textAlign: 'center',
  },
  detailModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(21, 59, 101, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  detailModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  detailModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#153B65',
    marginBottom: 16,
  },
  detailItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9F0ED',
    gap: 12,
  },
  detailLabel: {
    fontSize: 13,
    color: '#7A8FA8',
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#153B65',
    textAlign: 'right',
  },
  detailCloseButton: {
    marginTop: 18,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#153B65',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCloseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CustomerHistoryView;
