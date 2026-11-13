/**
 * UI-10 Riwayat Pelanggan — Kelas DPPL C02 PenggunaUI & C17 KontrakPekerjaanUI
 * Traceability:
 * - Tabel 6.10 DPPL (UI-10-01 s.d. UI-10-06)
 * - UC07 (Pelanggan mengonfirmasi penyelesaian pekerjaan dan pembayaran -> Tombol "Konfirmasi Selesai")
 * - UC10 (Pelanggan memberikan rating dan ulasan -> Tombol "Beri Rating" & Slot UI-11)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import {
  CustomerTransactionItem,
  HistoryDisplayStatus,
  HistoryFilterTab,
} from '../../types/chat';
import {
  contractService,
  formatTanggalSelesaiIndonesia,
  getCachedCustomerHistory,
  resetMockContracts,
  subscribeContracts,
} from '../../services/contractService';
import {
  filterCustomerTransactionsByTab,
  shouldShowBeriRatingButton,
  shouldShowKonfirmasiSelesaiButton,
  shouldShowLihatDetailButton,
} from '../../controllers/useContractController';

export type { HistoryFilterTab, CustomerTransactionItem };
export type TransactionDisplayStatus = HistoryDisplayStatus;

export interface RatingSlotProps {
  visible: boolean;
  transaction: CustomerTransactionItem | null;
  onClose: () => void;
  onSubmitted: (
    idKontrak: string,
    nilaiRating: number,
    komentar?: string
  ) => void;
}

let registeredRatingSlotComponent: React.ComponentType<RatingSlotProps> | null =
  null;

/**
 * Mendaftarkan komponen eksternal untuk slot Rating (UI-11) apabila dibutuhkan saat integrasi branch rating.
 */
export function registerRatingSlotComponent(
  component: React.ComponentType<RatingSlotProps> | null
): void {
  registeredRatingSlotComponent = component;
}

export const INITIAL_CUSTOMER_TRANSACTIONS: CustomerTransactionItem[] =
  getCachedCustomerHistory();

/**
 * Menandai kontrak sebagai sudah dinilai pada store bersama (kompatibel penuh dengan branch feat/frontend-rating-ui).
 */
export function markTransactionAsRated(
  idKontrak: string,
  nilaiRating?: number,
  komentar?: string
): void {
  contractService.markContractRated(idKontrak, nilaiRating, komentar);
}

/**
 * Mereset daftar transaksi ke kondisi awal untuk keperluan pengujian.
 */
export function resetCustomerTransactions(): void {
  resetMockContracts();
}

function formatRupiah(amount: number): string {
  const formatted = Math.max(0, Math.round(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

const FILTER_TABS: HistoryFilterTab[] = ['Semua', 'Selesai', 'On Progress'];

export interface CustomerHistoryViewProps {
  initialTransactions?: CustomerTransactionItem[];
  RatingSlotComponent?: React.ComponentType<RatingSlotProps>;
  onOpenRatingSlot?: (transaction: CustomerTransactionItem) => void;
}

export const CustomerHistoryView: React.FC<CustomerHistoryViewProps> = ({
  initialTransactions,
  RatingSlotComponent,
  onOpenRatingSlot,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [activeTab, setActiveTab] = useState<HistoryFilterTab>('Semua');
  const [transactions, setTransactions] = useState<CustomerTransactionItem[]>(
    () => initialTransactions ?? getCachedCustomerHistory()
  );
  const [selectedDetail, setSelectedDetail] =
    useState<CustomerTransactionItem | null>(null);
  const [ratingSlotTarget, setRatingSlotTarget] =
    useState<CustomerTransactionItem | null>(null);
  const [slotStars, setSlotStars] = useState<number>(5);
  const [slotComment, setSlotComment] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);

  const syncTransactions = useCallback(() => {
    if (initialTransactions) return;
    setTransactions(getCachedCustomerHistory());
  }, [initialTransactions]);

  useEffect(() => {
    if (initialTransactions) {
      setTransactions(initialTransactions);
      return;
    }
    syncTransactions();
    const unsubscribe = subscribeContracts(() => {
      syncTransactions();
    });
    return unsubscribe;
  }, [initialTransactions, syncTransactions]);

  useFocusEffect(
    useCallback(() => {
      if (!initialTransactions) {
        syncTransactions();
        void contractService.fetchContractHistory().then(() => {
          syncTransactions();
        });
      }
    }, [initialTransactions, syncTransactions])
  );

  const filteredTransactions = useMemo(
    () => filterCustomerTransactionsByTab(transactions, activeTab),
    [transactions, activeTab]
  );

  /**
   * Membuka alur Beri Rating (UI-10-06 -> UI-11):
   * - Apabila layar 'Rating' sudah terdaftar di RootNavigator (setelah merge branch rating), navigasi langsung ke 'Rating'.
   * - Apabila belum terdaftar, tampilkan slot Rating (UI-11) bawaan yang terhubung ke POST /api/ratings.
   */
  const openRatingFlow = useCallback(
    (item: CustomerTransactionItem) => {
      if (onOpenRatingSlot) {
        onOpenRatingSlot(item);
        return;
      }

      const navState =
        typeof navigation.getState === 'function'
          ? navigation.getState()
          : undefined;
      const hasRatingRoute =
        Array.isArray(navState?.routeNames) &&
        navState.routeNames.includes('Rating');

      if (hasRatingRoute) {
        navigation.navigate('Rating', {
          idKontrak: item.idKontrak,
          idPemberiJasa: item.idPemberiJasa,
          namaPemberiJasa: item.namaPemberiJasa,
          kategoriJasa: item.kategoriJasa,
          rincianPekerjaan: item.rincianPekerjaan,
          tanggalSelesai:
            item.tanggalSelesai ||
            formatTanggalSelesaiIndonesia(item.tanggalWaktu),
          biayaLayanan: item.totalHarga,
          inisialPemberiJasa: item.inisialPemberiJasa,
        });
        return;
      }

      setSlotStars(5);
      setSlotComment('');
      setRatingSlotTarget(item);
    },
    [navigation, onOpenRatingSlot]
  );

  /**
   * UC07: Pelanggan menekan tombol "Konfirmasi Selesai" pada pesanan yang dilaporkan selesai oleh penyedia jasa.
   * Memanggil PATCH /api/kontrak/:id/konfirmasi dan mengubah status menjadi 'Done' ('Selesai').
   */
  const handleConfirmComplete = useCallback(
    async (item: CustomerTransactionItem) => {
      if (confirmingId) return;
      setConfirmingId(item.idKontrak);
      try {
        await contractService.confirmWorkByCustomer(item.idKontrak);

        if (initialTransactions) {
          setTransactions((prev) =>
            prev.map((tx) =>
              tx.idKontrak === item.idKontrak
                ? {
                    ...tx,
                    statusPekerjaan: 'Done',
                    statusDisplay: 'Selesai',
                  }
                : tx
            )
          );
        } else {
          syncTransactions();
        }

        setBannerMessage(
          'Pekerjaan berhasil dikonfirmasi selesai. Anda kini dapat memberikan rating.'
        );
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Gagal mengonfirmasi penyelesaian pekerjaan.';
        setBannerMessage(msg);
      } finally {
        setConfirmingId(null);
      }
    },
    [confirmingId, initialTransactions, syncTransactions]
  );

  const handleSlotSubmitRating = useCallback(async () => {
    if (!ratingSlotTarget || isSubmittingRating) return;
    setIsSubmittingRating(true);
    try {
      await contractService.submitContractRating({
        idKontrak: ratingSlotTarget.idKontrak,
        idPemberiJasa: ratingSlotTarget.idPemberiJasa,
        nilaiRating: slotStars,
        komentar: slotComment,
      });

      if (initialTransactions) {
        setTransactions((prev) =>
          prev.map((tx) =>
            tx.idKontrak === ratingSlotTarget.idKontrak
              ? {
                  ...tx,
                  hasRating: true,
                  nilaiRating: slotStars,
                  komentar: slotComment,
                }
              : tx
          )
        );
      } else {
        syncTransactions();
      }

      setRatingSlotTarget(null);
      setBannerMessage('Terima kasih! Penilaian Anda berhasil disimpan.');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Gagal menyimpan penilaian.';
      setBannerMessage(msg);
    } finally {
      setIsSubmittingRating(false);
    }
  }, [
    initialTransactions,
    isSubmittingRating,
    ratingSlotTarget,
    slotComment,
    slotStars,
    syncTransactions,
  ]);

  const ActiveRatingSlot = RatingSlotComponent ?? registeredRatingSlotComponent;

  const renderBadge = (item: CustomerTransactionItem) => {
    if (item.statusDisplay === 'On Progress') {
      return (
        <View
          style={[styles.badge, styles.badgeOnProgress]}
          testID={`UI-10-04-badge-${item.idKontrak}`}
        >
          <View style={[styles.badgeDot, styles.dotOnProgress]} />
          <Text style={[styles.badgeText, styles.badgeTextOnProgress]}>
            On Progress
          </Text>
        </View>
      );
    }

    if (item.statusDisplay === 'Selesai') {
      return (
        <View
          style={[styles.badge, styles.badgeSelesai]}
          testID={`UI-10-04-badge-${item.idKontrak}`}
        >
          <View style={[styles.badgeDot, styles.dotSelesai]} />
          <Text style={[styles.badgeText, styles.badgeTextSelesai]}>
            Selesai
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[styles.badge, styles.badgeDibatalkan]}
        testID={`UI-10-04-badge-${item.idKontrak}`}
      >
        <View style={[styles.badgeDot, styles.dotDibatalkan]} />
        <Text style={[styles.badgeText, styles.badgeTextDibatalkan]}>
          Dibatalkan
        </Text>
      </View>
    );
  };

  const renderCard = ({ item }: { item: CustomerTransactionItem }) => {
    const showConfirmCompleteButton = shouldShowKonfirmasiSelesaiButton(
      item.statusPekerjaan
    );
    const showDetailButton = shouldShowLihatDetailButton(
      item.statusPekerjaan,
      item.statusDisplay
    );
    const showRateButton = shouldShowBeriRatingButton(
      item.statusPekerjaan,
      item.hasRating,
      item.statusDisplay
    );
    const isConfirming = confirmingId === item.idKontrak;

    return (
      <View
        style={styles.card}
        testID={`UI-10-03-card-${item.idKontrak}`}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.cardTitleBlock}>
            <Text style={styles.cardTitle}>{item.rincianPekerjaan}</Text>
            <Text style={styles.cardDate}>{item.tanggalWaktu}</Text>
          </View>
          {renderBadge(item)}
        </View>

        <View style={styles.dashedDivider} />

        <View style={styles.providerRow}>
          <View style={styles.providerInfo}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {item.inisialPemberiJasa}
              </Text>
            </View>
            <Text style={styles.providerName}>{item.namaPemberiJasa}</Text>
          </View>
          <Text style={styles.priceText}>{formatRupiah(item.totalHarga)}</Text>
        </View>

        {/* UC07: Tombol "Konfirmasi Selesai" pada pesanan yang dilaporkan selesai oleh penyedia jasa */}
        {showConfirmCompleteButton && (
          <View style={styles.confirmActionWrap}>
            <Text style={styles.waitingConfirmationInfo}>
              Penyedia jasa telah menyelesaikan pekerjaan ini
            </Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => setSelectedDetail(item)}
                testID={`UI-10-05-detail-${item.idKontrak}`}
                accessibilityRole="button"
                accessibilityLabel={`Lihat detail ${item.rincianPekerjaan}`}
              >
                <Text style={styles.detailButtonText}>Lihat Detail</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmCompleteButton,
                  isConfirming && styles.buttonDisabled,
                ]}
                onPress={() => handleConfirmComplete(item)}
                disabled={isConfirming}
                testID={`UI-10-confirm-complete-${item.idKontrak}`}
                accessibilityRole="button"
                accessibilityLabel={`Konfirmasi selesai ${item.rincianPekerjaan}`}
              >
                {isConfirming ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmCompleteButtonText}>
                    Konfirmasi Selesai
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* UI-10-05 ("Lihat Detail") & UI-10-06 ("Beri Rating") untuk pesanan berstatus Selesai */}
        {showDetailButton && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => setSelectedDetail(item)}
              testID={`UI-10-05-detail-${item.idKontrak}`}
              accessibilityRole="button"
              accessibilityLabel={`Lihat detail ${item.rincianPekerjaan}`}
            >
              <Text style={styles.detailButtonText}>Lihat Detail</Text>
            </TouchableOpacity>

            {showRateButton ? (
              <TouchableOpacity
                style={styles.rateButton}
                onPress={() => openRatingFlow(item)}
                testID={`UI-10-06-rate-${item.idKontrak}`}
                accessibilityRole="button"
                accessibilityLabel={`Beri rating untuk ${item.namaPemberiJasa}`}
              >
                <Text style={styles.rateButtonText}>Beri Rating</Text>
              </TouchableOpacity>
            ) : (
              <View
                style={styles.ratedBadge}
                testID={`UI-10-rated-indicator-${item.idKontrak}`}
              >
                <Text style={styles.ratedBadgeText}>
                  ★ Sudah Dinilai
                  {typeof item.nilaiRating === 'number'
                    ? ` (${item.nilaiRating.toFixed(1)})`
                    : ''}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* UI-10-01 Header "Riwayat" */}
        <View style={styles.headerBlock} testID="UI-10-01-header">
          <Text style={styles.headerTitle}>Riwayat</Text>
          <Text style={styles.headerSubtitle}>Semua transaksi jasamu</Text>
        </View>

        {bannerMessage && (
          <View
            style={styles.successBanner}
            testID="UI-10-rating-success-banner"
          >
            <Text style={styles.successBannerText}>{bannerMessage}</Text>
            <TouchableOpacity
              onPress={() => setBannerMessage(null)}
              accessibilityRole="button"
              accessibilityLabel="Tutup pesan"
            >
              <Text style={styles.successBannerDismiss}>Tutup</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* UI-10-02 Chip Filter Status */}
        <View style={styles.filterRow} testID="UI-10-02-filter-row">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveTab(tab)}
                testID={`UI-10-02-filter-${tab}`}
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

        {/* UI-10-03 Daftar Kartu Transaksi */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.idKontrak}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          testID="UI-10-03-transaction-list"
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
              <Text style={styles.emptyDesc}>
                Tidak ada riwayat transaksi untuk filter {activeTab}.
              </Text>
            </View>
          }
        />

        {/* Modal UI-10-05 "Lihat Detail" */}
        <Modal
          visible={selectedDetail !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedDetail(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard} testID="UI-10-05-detail-modal">
              <Text style={styles.modalTitle}>Detail Transaksi</Text>
              {selectedDetail && (
                <>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Pekerjaan</Text>
                    <Text style={styles.modalValue}>
                      {selectedDetail.rincianPekerjaan}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Penyedia Jasa</Text>
                    <Text style={styles.modalValue}>
                      {selectedDetail.namaPemberiJasa}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Waktu</Text>
                    <Text style={styles.modalValue}>
                      {selectedDetail.tanggalWaktu}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Status</Text>
                    <Text style={styles.modalValue}>
                      {selectedDetail.statusPekerjaan ===
                      'Menunggu Konfirmasi Pelanggan'
                        ? 'Menunggu Konfirmasi Pelanggan'
                        : selectedDetail.statusDisplay}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Total Harga</Text>
                    <Text style={styles.modalValue}>
                      {formatRupiah(selectedDetail.totalHarga)}
                    </Text>
                  </View>
                </>
              )}
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setSelectedDetail(null)}
                testID="UI-10-05-close-detail"
              >
                <Text style={styles.modalCloseText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Slot Komponen Rating (UI-11) agar kompatibel saat merge dengan branch rating */}
        {ActiveRatingSlot ? (
          <ActiveRatingSlot
            visible={ratingSlotTarget !== null}
            transaction={ratingSlotTarget}
            onClose={() => setRatingSlotTarget(null)}
            onSubmitted={(idKontrak, nilaiRating, komentar) => {
              markTransactionAsRated(idKontrak, nilaiRating, komentar);
              setRatingSlotTarget(null);
              syncTransactions();
              setBannerMessage(
                'Terima kasih! Penilaian Anda berhasil disimpan.'
              );
            }}
          />
        ) : (
          <Modal
            visible={ratingSlotTarget !== null}
            transparent
            animationType="fade"
            onRequestClose={() => setRatingSlotTarget(null)}
          >
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard} testID="UI-11-rating-slot-modal">
                <Text style={styles.modalTitle}>Beri Rating</Text>
                {ratingSlotTarget && (
                  <>
                    <Text style={styles.ratingSubtitle}>
                      Bagaimana hasil pekerjaan{' '}
                      <Text style={styles.ratingProviderBold}>
                        {ratingSlotTarget.namaPemberiJasa}
                      </Text>{' '}
                      ({ratingSlotTarget.rincianPekerjaan})?
                    </Text>

                    <View style={styles.starsRow} testID="UI-11-slot-stars">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = star <= slotStars;
                        return (
                          <TouchableOpacity
                            key={star}
                            onPress={() => setSlotStars(star)}
                            testID={`UI-11-slot-star-${star}`}
                            style={[
                              styles.starBtn,
                              active && styles.starBtnActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.starText,
                                active && styles.starTextActive,
                              ]}
                            >
                              ★
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <TextInput
                      style={styles.commentInput}
                      placeholder="Tulis ulasan singkat Anda (opsional)..."
                      placeholderTextColor="#94A3B8"
                      value={slotComment}
                      onChangeText={setSlotComment}
                      multiline
                      testID="UI-11-slot-comment-input"
                    />

                    <View style={styles.slotActionsRow}>
                      <TouchableOpacity
                        style={styles.slotCancelBtn}
                        onPress={() => setRatingSlotTarget(null)}
                        testID="UI-11-slot-cancel"
                      >
                        <Text style={styles.slotCancelText}>Batal</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.slotSubmitBtn,
                          isSubmittingRating && styles.buttonDisabled,
                        ]}
                        onPress={handleSlotSubmitRating}
                        disabled={isSubmittingRating}
                        testID="UI-11-slot-submit"
                      >
                        <Text style={styles.slotSubmitText}>
                          {isSubmittingRating ? 'Mengirim...' : 'Kirim Rating'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
        )}
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
    paddingTop: 18,
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 10,
  },
  successBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
  },
  successBannerDismiss: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
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
    color: '#7A8EA4',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeOnProgress: {
    backgroundColor: '#FDF1DC',
  },
  dotOnProgress: {
    backgroundColor: '#B25E00',
  },
  badgeTextOnProgress: {
    color: '#B25E00',
  },
  badgeSelesai: {
    backgroundColor: '#DCF4ED',
  },
  dotSelesai: {
    backgroundColor: '#0B8F6A',
  },
  badgeTextSelesai: {
    color: '#0B8F6A',
  },
  badgeDibatalkan: {
    backgroundColor: '#FDE8E8',
  },
  dotDibatalkan: {
    backgroundColor: '#D92D20',
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
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DCF4ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 13,
    fontWeight: '800',
    color: '#153B65',
  },
  providerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#153B65',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#153B65',
  },
  confirmActionWrap: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
  },
  waitingConfirmationInfo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B25E00',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
  },
  detailButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD6E3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#153B65',
  },
  confirmCompleteButton: {
    flex: 1.25,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#0E9F6E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCompleteButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rateButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#EE9B3A',
    alignItems: 'center',
  },
  rateButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#153B65',
  },
  ratedBadge: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  ratedBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
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
  modalCloseBtn: {
    marginTop: 18,
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
  ratingSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 14,
  },
  ratingProviderBold: {
    fontWeight: '700',
    color: '#153B65',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  starBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBtnActive: {
    borderColor: '#F59E0B',
    backgroundColor: '#FEF3C7',
  },
  starText: {
    fontSize: 22,
    color: '#CBD5E1',
  },
  starTextActive: {
    color: '#F59E0B',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 80,
    fontSize: 13,
    color: '#1E293B',
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  slotActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  slotCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  slotCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  slotSubmitBtn: {
    flex: 1.2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#0E9F6E',
    alignItems: 'center',
  },
  slotSubmitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default CustomerHistoryView;
