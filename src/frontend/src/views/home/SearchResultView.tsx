/**
 * [Naufal Hasbialhaq] UI-06 Hasil Pencarian & Peta
 * Traceability: UC02 (Skenario Normal & Alternatif 1), KF01, KF03, KF08,
 * Kelas DPPL C05 PemberiJasaUI, C14 KategoriJasaUI, Antarmuka UI-06 (UI-06-01 s.d. UI-06-07)
 */

import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header, UI_THEME } from '../../components/Header';
import { Button } from '../../components/Button';
import { MapViewCard } from '../../components/MapViewCard';
import { RootStackScreenProps } from '../../navigation/types';
import {
  PemberiJasaDetail,
  SortKey,
} from '../../services/serviceCatalogService';
import {
  EMPTY_PROVIDER_MESSAGE,
  formatJarak,
  formatRating,
  formatTarifRupiah,
  getInitials,
  getProviderDisplayName,
  useSearchResultController,
} from '../../controllers/useCatalogController';

const AVATAR_PALETTE = ['#E3F5F1', '#E6EEF8', '#FDF1E3'] as const;
const STAR_COLOR = '#F5A142';
const OFFLINE_DOT_COLOR = '#B0B8C1';

interface ProviderCardProps {
  provider: PemberiJasaDetail;
  index: number;
  sortBy: SortKey;
  onPressCard: (idPemberiJasa: string) => void;
  onPressChat: (provider: PemberiJasaDetail) => void;
}

const ProviderCardComponent: React.FC<ProviderCardProps> = ({
  provider,
  index,
  sortBy,
  onPressCard,
  onPressChat,
}) => {
  const displayName = getProviderDisplayName(provider);
  const initials = getInitials(displayName);
  const avatarBg = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
  const ratingText = formatRating(provider.akumulasiRating);
  const distanceText = formatJarak(provider.jarakKm);
  const jenisJasaText = provider.jenisJasa?.trim() || 'Layanan Jasa';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPressCard(provider.idPemberiJasa)}
      accessibilityRole="button"
      accessibilityLabel={`${displayName}, rating ${ratingText}, jarak ${distanceText}, ${provider.isOnline ? 'sedang online' : 'offline'}`}
      testID={`ui06-provider-card-${provider.idPemberiJasa}`}
    >
      {/* UI-06-06: Avatar Inisial & Indikator Online */}
      <View style={[styles.avatarBox, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarInitials}>{initials}</Text>
        <View
          style={[
            styles.onlineDot,
            provider.isOnline ? styles.onlineDotActive : styles.onlineDotIdle,
          ]}
        />
      </View>

      {/* UI-06-06: Informasi Utama Penyedia Jasa */}
      <View style={styles.cardCenter}>
        <Text style={styles.providerName} numberOfLines={1}>
          {displayName}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <Ionicons name="star" size={14} color={STAR_COLOR} />
            <Text style={styles.metaText}>{ratingText}</Text>
          </View>

          <View style={styles.metaBadge}>
            <Ionicons
              name="location-outline"
              size={14}
              color={UI_THEME.primary}
            />
            <Text style={styles.metaText}>{distanceText}</Text>
          </View>
        </View>

        <Text style={styles.serviceSubtext} numberOfLines={1}>
          {jenisJasaText}
          {sortBy === 'termurah'
            ? ` · ${formatTarifRupiah(provider.tarif)}`
            : ''}
        </Text>
      </View>

      {/* UI-06-07: Tombol Chat menuju UI-08 */}
      <Pressable
        style={({ pressed }) => [
          styles.chatButton,
          pressed && styles.chatButtonPressed,
        ]}
        onPress={() => onPressChat(provider)}
        accessibilityRole="button"
        accessibilityLabel={`Chat dengan ${displayName}`}
        testID={`ui06-chat-button-${provider.idPemberiJasa}`}
      >
        <Text style={styles.chatButtonText}>Chat</Text>
      </Pressable>
    </Pressable>
  );
};

const ProviderCard = React.memo(ProviderCardComponent);
ProviderCard.displayName = 'ProviderCard';

interface ProviderSummarySheetProps {
  provider: PemberiJasaDetail | null;
  isDetailLoading: boolean;
  detailError: string | null;
  onClose: () => void;
  onPressChat: (provider: PemberiJasaDetail) => void;
}

const ProviderSummarySheet: React.FC<ProviderSummarySheetProps> = ({
  provider,
  isDetailLoading,
  detailError,
  onClose,
  onPressChat,
}) => {
  if (!provider) {
    return null;
  }

  const displayName = getProviderDisplayName(provider);
  const initials = getInitials(displayName);
  const jenisJasaVal = provider.jenisJasa?.trim() || '–';
  const deskripsiVal = provider.deskripsiJasa?.trim() || '–';
  const jamKerjaVal = provider.jamKerja?.trim() || '–';
  const daerahKerjaVal = provider.daerahKerja?.trim() || '–';

  return (
    <Modal
      visible={Boolean(provider)}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetBackdrop} testID="ui06-provider-sheet">
        <Pressable
          style={styles.sheetBackdropTouch}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Tutup ringkasan profil penyedia jasa"
        />

        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />

          {isDetailLoading ? (
            <View style={styles.sheetLoadingIndicator}>
              <ActivityIndicator size="small" color={UI_THEME.primary} />
            </View>
          ) : null}

          {/* Header Ringkasan Profil Penyedia */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetAvatar}>
              <Text style={styles.sheetAvatarText}>{initials}</Text>
              <View
                style={[
                  styles.onlineDot,
                  provider.isOnline
                    ? styles.onlineDotActive
                    : styles.onlineDotIdle,
                ]}
              />
            </View>

            <View style={styles.sheetHeaderInfo}>
              <Text style={styles.sheetTitle} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.sheetOwnerName} numberOfLines={1}>
                {provider.namaPengguna}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                provider.isOnline
                  ? styles.statusBadgeOnline
                  : styles.statusBadgeOffline,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  provider.isOnline
                    ? styles.statusBadgeTextOnline
                    : styles.statusBadgeTextOffline,
                ]}
              >
                {provider.isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>

          {/* Baris Statistik: Rating | Jarak | Tarif */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <View style={styles.statValueRow}>
                <Ionicons name="star" size={15} color={STAR_COLOR} />
                <Text style={styles.statValue}>
                  {formatRating(provider.akumulasiRating)}
                </Text>
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatJarak(provider.jarakKm)}
              </Text>
              <Text style={styles.statLabel}>Jarak</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue} numberOfLines={1}>
                {formatTarifRupiah(provider.tarif)}
              </Text>
              <Text style={styles.statLabel}>Estimasi Tarif</Text>
            </View>
          </View>

          {/* Detail Informasi Jasa & Lokasi (KF08) */}
          <View style={styles.detailList}>
            <View style={styles.detailRow}>
              <Ionicons
                name="briefcase-outline"
                size={18}
                color={UI_THEME.primary}
              />
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>Jenis Jasa</Text>
                <Text style={styles.detailValue}>{jenisJasaVal}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={UI_THEME.primary}
              />
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>Deskripsi Layanan</Text>
                <Text style={styles.detailValue} numberOfLines={4}>
                  {deskripsiVal}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons
                name="time-outline"
                size={18}
                color={UI_THEME.primary}
              />
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>Jam Operasional</Text>
                <Text style={styles.detailValue}>{jamKerjaVal}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons
                name="map-outline"
                size={18}
                color={UI_THEME.primary}
              />
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>Daerah Kerja</Text>
                <Text style={styles.detailValue}>{daerahKerjaVal}</Text>
              </View>
            </View>
          </View>

          {detailError ? (
            <Text style={styles.detailErrorText}>{detailError}</Text>
          ) : null}

          <View style={styles.sheetActions}>
            <Button
              title="Chat Sekarang"
              onPress={() => onPressChat(provider)}
              testID="ui06-sheet-chat-button"
            />
            <Button
              title="Tutup"
              variant="secondary"
              onPress={onClose}
              style={styles.closeSheetBtn}
              testID="ui06-sheet-close-button"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const SearchResultView: React.FC<
  RootStackScreenProps<'SearchResult'>
> = ({ navigation, route }) => {
  const {
    keyword,
    setKeyword,
    clearKeyword,
    submitKeyword,
    activeKeyword,
    sortBy,
    setSortBy,
    sortOptions,
    providers,
    isLoading,
    isRefreshing,
    error,
    isEmpty,
    hasFetched,
    refresh,
    retry,
    coordinates,
    isLocationResolved,
    selectedProviderId,
    selectedProvider,
    isDetailLoading,
    detailError,
    choosePemberiJasa,
    dismissPemberiJasa,
  } = useSearchResultController(route.params);

  // C05 PemberiJasaUI.pressPemberiJasa
  const pressPemberiJasa = useCallback(
    (idPemberiJasa: string) => {
      void choosePemberiJasa(idPemberiJasa);
    },
    [choosePemberiJasa]
  );

  // C05 PemberiJasaUI.pressChat
  const pressChat = useCallback(
    (provider: PemberiJasaDetail) => {
      dismissPemberiJasa();
      navigation.navigate('CustomerChat', {
        idPemberiJasa: provider.idPemberiJasa,
        namaPemberiJasa: getProviderDisplayName(provider),
        isOnline: provider.isOnline,
      });
    },
    [dismissPemberiJasa, navigation]
  );

  // KF03 & C05 PemberiJasaUI.showPemberiJasaMap
  const showPemberiJasaMap = () => {
    if (providers.length === 0) {
      return null;
    }
    return (
      <MapViewCard
        userCoordinates={coordinates}
        providers={providers}
        selectedProviderId={selectedProviderId}
        onPressProvider={pressPemberiJasa}
      />
    );
  };

  // KF08 & C05 PemberiJasaUI.showPemberiJasaKategori
  const showPemberiJasaKategori = () => (
    <ProviderSummarySheet
      provider={selectedProvider}
      isDetailLoading={isDetailLoading}
      detailError={detailError}
      onClose={dismissPemberiJasa}
      onPressChat={pressChat}
    />
  );

  const listHeader = (
    <View style={styles.headerSection}>
      {/* UI-06-01 & UI-06-02: Tombol Kembali dan Judul Hasil Pencarian */}
      <Header
        title="Hasil Pencarian"
        onBackPress={() => navigation.goBack()}
        testID="ui06-header"
      />

      {/* UI-06-03 & UI-06-04: Search Field dan Tombol Clear (×) */}
      <View style={styles.searchField}>
        <Ionicons
          name="search-outline"
          size={20}
          color={UI_THEME.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Cari jasa..."
          placeholderTextColor={UI_THEME.textMuted}
          returnKeyType="search"
          onSubmitEditing={submitKeyword}
          accessibilityLabel="Kata kunci pencarian jasa"
          testID="ui06-search-input"
        />
        {keyword.length > 0 ? (
          <Pressable
            onPress={clearKeyword}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Hapus kata kunci pencarian"
            testID="ui06-clear-button"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={UI_THEME.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {/* UI-06-05: Chip Filter Tunggal (Terdekat, Rating Terbaik, Termurah) */}
      <View style={styles.chipRow}>
        {sortOptions.map((option) => {
          const isSelected = sortBy === option.key;
          return (
            <Pressable
              key={option.key}
              style={[
                styles.chip,
                isSelected ? styles.chipActive : styles.chipInactive,
              ]}
              onPress={() => setSortBy(option.key)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Urutkan berdasarkan ${option.label}`}
              testID={`ui06-chip-${option.key}`}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextActive : styles.chipTextInactive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {sortBy === 'terdekat' && coordinates === null && isLocationResolved ? (
        <View style={styles.locationHintRow} testID="ui06-location-hint">
          <Ionicons
            name="information-circle-outline"
            size={15}
            color={UI_THEME.textMuted}
          />
          <Text style={styles.locationHintText}>
            Aktifkan izin lokasi untuk mengurutkan berdasarkan jarak.
          </Text>
        </View>
      ) : null}

      {/* KF03: showPemberiJasaMap */}
      {showPemberiJasaMap()}

      {hasFetched && !isLoading && !error && providers.length > 0 ? (
        <Text style={styles.resultCountText} testID="ui06-result-count">
          {`${providers.length} penyedia ditemukan${activeKeyword ? ` untuk "${activeKeyword}"` : ''}`}
        </Text>
      ) : null}
    </View>
  );

  const renderEmptyComponent = () => {
    if (isLoading && !hasFetched) {
      return (
        <View style={styles.skeletonWrap} testID="ui06-loading-skeleton">
          {[0, 1, 2].map((item) => (
            <View key={item} style={styles.skeletonCard} />
          ))}
          <ActivityIndicator
            size="small"
            color={UI_THEME.primary}
            style={styles.skeletonSpinner}
          />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.stateBox} testID="ui06-error-state">
          <Ionicons
            name="cloud-offline-outline"
            size={48}
            color={UI_THEME.error}
          />
          <Text style={styles.stateTitle}>{error}</Text>
          <View style={styles.stateButtonWrap}>
            <Button
              title="Coba Lagi"
              onPress={() => void retry()}
              testID="ui06-retry-button"
            />
          </View>
        </View>
      );
    }

    if (isEmpty) {
      return (
        /* UC02 Alternatif 1: Pemberi Jasa Tidak Ditemukan */
        <View style={styles.stateBox} testID="ui06-empty-state">
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name="search-outline"
              size={36}
              color={UI_THEME.primary}
            />
          </View>
          <Text style={styles.stateTitle}>{EMPTY_PROVIDER_MESSAGE}</Text>
          <Text style={styles.stateSubtitle}>
            Coba kata kunci lain atau pilih kategori jasa yang berbeda.
          </Text>
          <View style={styles.stateButtonWrap}>
            <Button
              title="Pilih Jasa Lain"
              variant="secondary"
              onPress={() => navigation.goBack()}
              testID="ui06-choose-other-button"
            />
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <FlatList
        data={providers}
        keyExtractor={(item) => item.idPemberiJasa}
        renderItem={({ item, index }) => (
          <ProviderCard
            provider={item}
            index={index}
            sortBy={sortBy}
            onPressCard={pressPemberiJasa}
            onPressChat={pressChat}
          />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void refresh()}
            tintColor={UI_THEME.primary}
            colors={[UI_THEME.primary]}
          />
        }
      />

      {/* KF08: showPemberiJasaKategori */}
      {showPemberiJasaKategori()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: UI_THEME.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    flexGrow: 1,
  },
  headerSection: {
    marginBottom: 8,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    paddingHorizontal: 14,
    minHeight: 52,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: UI_THEME.textTitle,
    paddingVertical: 10,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: UI_THEME.textTitle,
    borderColor: UI_THEME.textTitle,
  },
  chipInactive: {
    backgroundColor: UI_THEME.surface,
    borderColor: UI_THEME.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: UI_THEME.surface,
  },
  chipTextInactive: {
    color: UI_THEME.textMuted,
  },
  locationHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationHintText: {
    fontSize: 12,
    color: UI_THEME.textMuted,
    flex: 1,
  },
  resultCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: UI_THEME.textMuted,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    marginBottom: 12,
    gap: 12,
  },
  cardPressed: {
    opacity: 0.85,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '800',
    color: UI_THEME.textTitle,
  },
  onlineDot: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: UI_THEME.surface,
  },
  onlineDotActive: {
    backgroundColor: UI_THEME.primary,
  },
  onlineDotIdle: {
    backgroundColor: OFFLINE_DOT_COLOR,
  },
  cardCenter: {
    flex: 1,
    gap: 4,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: UI_THEME.textMuted,
  },
  serviceSubtext: {
    fontSize: 12,
    color: UI_THEME.textMuted,
  },
  chatButton: {
    backgroundColor: UI_THEME.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  chatButtonPressed: {
    opacity: 0.8,
  },
  chatButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: UI_THEME.surface,
  },
  skeletonWrap: {
    gap: 12,
    paddingTop: 4,
  },
  skeletonCard: {
    height: 82,
    borderRadius: 16,
    backgroundColor: '#E5ECEA',
  },
  skeletonSpinner: {
    marginTop: 8,
  },
  stateBox: {
    backgroundColor: UI_THEME.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E3F5F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  stateSubtitle: {
    fontSize: 13,
    color: UI_THEME.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
  stateButtonWrap: {
    width: '100%',
    marginTop: 18,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetBackdropTouch: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: UI_THEME.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: UI_THEME.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetLoadingIndicator: {
    position: 'absolute',
    top: 16,
    right: 20,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sheetAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#E3F5F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetAvatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: UI_THEME.textTitle,
  },
  sheetHeaderInfo: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  sheetOwnerName: {
    fontSize: 13,
    color: UI_THEME.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusBadgeOnline: {
    backgroundColor: '#E3F5F1',
  },
  statusBadgeOffline: {
    backgroundColor: '#F0F3F5',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadgeTextOnline: {
    color: UI_THEME.primary,
  },
  statusBadgeTextOffline: {
    color: UI_THEME.textMuted,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.background,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  statLabel: {
    fontSize: 11,
    color: UI_THEME.textMuted,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: UI_THEME.border,
  },
  detailList: {
    gap: 12,
    marginBottom: 18,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  detailTextWrap: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: UI_THEME.textMuted,
  },
  detailValue: {
    fontSize: 14,
    color: UI_THEME.textBody,
    marginTop: 2,
    lineHeight: 20,
  },
  detailErrorText: {
    fontSize: 12,
    color: UI_THEME.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  sheetActions: {
    gap: 10,
  },
  closeSheetBtn: {
    marginTop: 2,
  },
});

export default SearchResultView;
