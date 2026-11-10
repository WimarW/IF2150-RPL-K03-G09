/**
 * [Naufal Hasbialhaq] UI-04 Beranda Pelanggan
 */

import React, { useCallback } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { UI_THEME } from '../../components/Header';
import {
  formatRating,
  formatTanggalPesanan,
  getInitials,
  getProviderDisplayName,
  OnProgressOrderSummary,
  useHomeCatalogController,
} from '../../controllers/useCatalogController';
import type {
  JenisJasa,
  PemberiJasaDetail,
} from '../../services/serviceCatalogService';
import type { RootStackParamList } from '../../navigation/types';

type IoniconName = keyof typeof Ionicons.glyphMap;

const ILLUSTRATION_PALETTE = ['#E3F5F1', '#E6EEF8', '#FDF1E3'] as const;

const CATEGORY_ICON_MAP: Record<JenisJasa, IoniconName> = {
  Servis: 'construct-outline',
  Kebersihan: 'sparkles-outline',
  Jahit: 'cut-outline',
  Renovasi: 'hammer-outline',
  Desain: 'laptop-outline',
  Lainnya: 'ellipsis-horizontal',
};

/**
 * Memetakan nama jenis jasa ke ikon Ionicons untuk ilustrasi kartu rekomendasi (UI-04-11)
 */
function getRecommendationIcon(jenisJasa: string | null): IoniconName {
  const lower = (jenisJasa ?? '').toLowerCase();
  if (lower.includes('mobil')) return 'car-outline';
  if (lower.includes('motor')) return 'bicycle-outline';
  if (/\bac\b/.test(lower) || lower.includes('cuci ac') || lower.includes('servis ac')) {
    return 'snow-outline';
  }
  if (lower.includes('sofa')) return 'bed-outline';
  if (
    lower.includes('baju') ||
    lower.includes('laundry') ||
    lower.includes('permak') ||
    lower.includes('jahit')
  ) {
    return 'shirt-outline';
  }
  if (lower.includes('karpet')) return 'grid-outline';
  if (lower.includes('servis') || lower.includes('elektronik')) {
    return 'construct-outline';
  }
  if (lower.includes('bersih') || lower.includes('kebersihan')) {
    return 'sparkles-outline';
  }
  if (lower.includes('pipa') || lower.includes('ledeng')) {
    return 'water-outline';
  }
  if (lower.includes('renovasi') || lower.includes('cat')) {
    return 'hammer-outline';
  }
  if (lower.includes('desain') || lower.includes('logo')) {
    return 'color-palette-outline';
  }
  return 'briefcase-outline';
}

// ============================================================================
// Sub-komponen Lokal (UI-04)
// ============================================================================

interface SectionHeaderProps {
  title: string;
  onPressSeeAll: () => void;
  seeAllAccessibilityLabel: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = React.memo(
  ({ title, onPressSeeAll, seeAllAccessibilityLabel }) => (
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable
        onPress={onPressSeeAll}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={seeAllAccessibilityLabel}
        style={({ pressed }) => [
          styles.seeAllButton,
          pressed && styles.pressedOpacity,
        ]}
      >
        <Text style={styles.seeAllText}>Lihat semua ›</Text>
      </Pressable>
    </View>
  )
);

SectionHeader.displayName = 'SectionHeader';

interface CategoryButtonProps {
  value: JenisJasa;
  label: string;
  width: number;
  onPress: (value: JenisJasa, label: string) => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = React.memo(
  ({ value, label, width, onPress }) => {
    const iconName = CATEGORY_ICON_MAP[value] ?? 'ellipsis-horizontal';
    const tileBg =
      value === 'Desain' || value === 'Lainnya' ? '#E6EEF8' : '#E3F5F1';
    const iconColor =
      value === 'Desain' ? UI_THEME.textTitle : UI_THEME.primary;

    return (
      <Pressable
        testID={`ui04-category-${value}`}
        onPress={() => onPress(value, label)}
        accessibilityRole="button"
        accessibilityLabel={`Kategori ${label}`}
        style={({ pressed }) => [
          styles.categoryItem,
          { width },
          pressed && styles.pressedOpacity,
        ]}
      >
        <View style={[styles.categoryTile, { backgroundColor: tileBg }]}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <Text style={styles.categoryLabel} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
    );
  }
);

CategoryButton.displayName = 'CategoryButton';

interface RecommendationCardProps {
  provider: PemberiJasaDetail;
  index: number;
  width: number;
  onPress: (provider: PemberiJasaDetail) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = React.memo(
  ({ provider, index, width, onPress }) => {
    const displayName = getProviderDisplayName(provider);
    const subtitle = provider.jenisJasa ?? 'Layanan Jasa';
    const illustrationBg =
      ILLUSTRATION_PALETTE[index % ILLUSTRATION_PALETTE.length];
    const iconName = getRecommendationIcon(provider.jenisJasa);
    const ratingLabel = formatRating(provider.akumulasiRating);

    return (
      <Pressable
        testID={`ui04-recommendation-${provider.idPemberiJasa}`}
        onPress={() => onPress(provider)}
        accessibilityRole="button"
        accessibilityLabel={`${displayName}, ${subtitle}, rating ${ratingLabel}`}
        style={({ pressed }) => [
          styles.recommendationCard,
          { width },
          pressed && styles.pressedOpacity,
        ]}
      >
        <View
          style={[
            styles.recommendationIllustration,
            { backgroundColor: illustrationBg },
          ]}
        >
          <Ionicons name={iconName} size={38} color={UI_THEME.primary} />
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={11} color="#FFFFFF" />
            <Text style={styles.ratingBadgeText}>{ratingLabel}</Text>
          </View>
        </View>

        <Text style={styles.recommendationTitle} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={styles.recommendationSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>

        <View style={styles.availabilityRow}>
          <View
            style={[
              styles.availabilityDot,
              {
                backgroundColor: provider.isOnline
                  ? UI_THEME.primary
                  : '#9AA5B1',
              },
            ]}
          />
          <Text
            style={[
              styles.availabilityText,
              provider.isOnline
                ? styles.availabilityOnlineText
                : styles.availabilityOfflineText,
            ]}
            numberOfLines={1}
          >
            {provider.isOnline ? 'Tersedia hari ini' : 'Bisa buat janji'}
          </Text>
        </View>
      </Pressable>
    );
  }
);

RecommendationCard.displayName = 'RecommendationCard';

interface OnProgressCardProps {
  activeOrder: OnProgressOrderSummary | null;
  onPressOrder: () => void;
}

const OnProgressCard: React.FC<OnProgressCardProps> = React.memo(
  ({ activeOrder, onPressOrder }) => {
    if (!activeOrder) {
      return (
        <View testID="ui04-on-progress" style={styles.onProgressEmptyCard}>
          <View style={styles.onProgressEmptyIconWrap}>
            <Ionicons
              name="time-outline"
              size={22}
              color={UI_THEME.textMuted}
            />
          </View>
          <Text style={styles.onProgressEmptyText}>
            Belum ada pesanan yang sedang berjalan.
          </Text>
        </View>
      );
    }

    return (
      <Pressable
        testID="ui04-on-progress"
        onPress={onPressOrder}
        accessibilityRole="button"
        accessibilityLabel={`Pesanan aktif ${activeOrder.judulPekerjaan}`}
        style={({ pressed }) => [
          styles.onProgressCard,
          pressed && styles.pressedOpacity,
        ]}
      >
        <View style={styles.onProgressIconTile}>
          <Ionicons name="cube-outline" size={24} color="#D97706" />
        </View>
        <View style={styles.onProgressTextColumn}>
          <Text style={styles.onProgressTitle} numberOfLines={1}>
            {activeOrder.judulPekerjaan}
          </Text>
          <Text style={styles.onProgressDate} numberOfLines={1}>
            {formatTanggalPesanan(activeOrder.createdAt)}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={UI_THEME.textMuted}
        />
      </Pressable>
    );
  }
);

OnProgressCard.displayName = 'OnProgressCard';

// ============================================================================
// Komponen Utama HomeView (UI-04)
// ============================================================================

export const HomeView: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  const {
    user,
    greetingName,
    isPenyediaJasa,
    popularCategories,
    recommendations,
    activeOrder,
    isLoadingRecommendations,
    isRefreshing,
    recommendationError,
    refresh,
  } = useHomeCatalogController();

  const categoryGap = 8;
  const categoryItemWidth = Math.max(
    48,
    Math.floor((width - 40 - categoryGap * 5) / 6)
  );
  const recommendationCardWidth = Math.max(148, Math.floor((width - 52) / 2));

  /**
   * Navigasi aman ke screen yang didaftarkan oleh branch anggota lain (UI-13 / UI-14)
   */
  const navigateIfRegistered = useCallback(
    (routeName: 'Notification' | 'Profile', label: string) => {
      const state =
        navigation.getParent()?.getState() ?? navigation.getState();
      const routeNames = state?.routeNames ?? [];
      if (routeNames.includes(routeName)) {
        navigation.navigate(routeName);
      } else {
        Alert.alert(
          'Segera Hadir',
          `Halaman ${label} sedang dikembangkan.`
        );
      }
    },
    [navigation]
  );

  /**
   * Handler C14 KategoriJasaUI.pressMenu → membuka UI-05 Rekomendasi Pencarian
   */
  const pressMenu = useCallback(() => {
    navigation.navigate('SearchRecommendation');
  }, [navigation]);

  /**
   * Handler C14 KategoriJasaUI.pressKategoriJasa → memilih kategori populer
   */
  const pressKategoriJasa = useCallback(
    (value: JenisJasa, label: string) => {
      if (value === 'Lainnya') {
        navigation.navigate('SearchRecommendation', { initialQuery: '' });
        return;
      }
      navigation.navigate('SearchResult', {
        keyword: label,
        kategori: label,
        initialSort: 'terdekat',
      });
    },
    [navigation]
  );

  /**
   * Handler tekan kartu rekomendasi (UI-04-11) → membuka UI-06 dan fokus ringkasan profil penyedia
   */
  const handlePressRecommendation = useCallback(
    (provider: PemberiJasaDetail) => {
      const displayName = getProviderDisplayName(provider);
      navigation.navigate('SearchResult', {
        keyword: provider.jenisJasa ?? displayName,
        focusProviderId: provider.idPemberiJasa,
      });
    },
    [navigation]
  );

  const handlePressBanner = useCallback(() => {
    if (isPenyediaJasa) {
      navigation.navigate('Main', { screen: 'Riwayat' });
      return;
    }
    navigation.navigate('ServiceRegistration');
  }, [isPenyediaJasa, navigation]);

  const handleOpenRiwayat = useCallback(() => {
    navigation.navigate('Main', { screen: 'Riwayat' });
  }, [navigation]);

  const renderRecommendationItem = useCallback(
    ({ item, index }: ListRenderItemInfo<PemberiJasaDetail>) => (
      <RecommendationCard
        provider={item}
        index={index}
        width={recommendationCardWidth}
        onPress={handlePressRecommendation}
      />
    ),
    [handlePressRecommendation, recommendationCardWidth]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void refresh();
            }}
            colors={[UI_THEME.primary]}
            tintColor={UI_THEME.primary}
          />
        }
      >
        {/* UI-04-01 & UI-04-02: Baris Brand CariUang & Tombol Notifikasi */}
        <View style={styles.brandHeaderRow}>
          <View style={styles.brandContainer}>
            <Ionicons
              name="search-circle"
              size={38}
              color={UI_THEME.primary}
              style={styles.brandIcon}
            />
            <View>
              <Text style={styles.brandTitle}>
                Cari<Text style={styles.brandTitleAccent}>Uang</Text>
              </Text>
              <Text style={styles.brandTagline}>
                PLATFORM JASA & KERJA INFORMAL
              </Text>
            </View>
          </View>

          {/* UI-04-02 */}
          <Pressable
            testID="ui04-notification-button"
            onPress={() => navigateIfRegistered('Notification', 'Notifikasi')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Buka notifikasi"
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.pressedOpacity,
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={UI_THEME.textTitle}
            />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* UI-04-03 & UI-04-04: Sapaan Pengguna & Avatar Profil */}
        <View style={styles.greetingRow}>
          <View style={styles.greetingTextWrap}>
            <Text style={styles.greetingTitle} numberOfLines={1}>
              Halo, {greetingName}! 👋
            </Text>
            <Text style={styles.greetingSubtitle}>
              Mau cari jasa atau peluang kerja hari ini?
            </Text>
          </View>

          {/* UI-04-04 */}
          <Pressable
            testID="ui04-avatar"
            onPress={() => navigateIfRegistered('Profile', 'Profil Saya')}
            accessibilityRole="button"
            accessibilityLabel="Buka profil pengguna"
            style={({ pressed }) => [
              styles.avatarCircle,
              pressed && styles.pressedOpacity,
            ]}
          >
            <Text style={styles.avatarInitials}>
              {getInitials(user.namaPengguna)}
            </Text>
          </Pressable>
        </View>

        {/* UI-04-05 & UI-04-06: Kolom Pencarian & Tombol Cari */}
        <Pressable
          testID="ui04-search-bar"
          onPress={pressMenu}
          accessibilityRole="search"
          accessibilityLabel="Cari jasa, pekerjaan, atau kategori"
          style={({ pressed }) => [
            styles.searchBar,
            pressed && styles.pressedOpacity,
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={UI_THEME.textMuted}
            style={styles.searchLeadingIcon}
          />
          <Text style={styles.searchPlaceholder} numberOfLines={1}>
            Cari jasa, pekerjaan, atau kategori...
          </Text>

          {/* UI-04-06 */}
          <Pressable
            testID="ui04-search-button"
            onPress={() =>
              navigation.navigate('SearchResult', {
                keyword: '',
                initialSort: 'terdekat',
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Cari penyedia terdekat"
            style={({ pressed }) => [
              styles.searchActionSquare,
              pressed && styles.pressedOpacity,
            ]}
          >
            <Ionicons name="search" size={20} color="#FFFFFF" />
          </Pressable>
        </Pressable>

        {/* UI-04-07: Header Kategori Populer */}
        <SectionHeader
          title="Kategori Populer"
          onPressSeeAll={() =>
            navigation.navigate('SearchRecommendation', { initialQuery: '' })
          }
          seeAllAccessibilityLabel="Lihat semua kategori jasa"
        />

        {/* UI-04-08: Grid 6 Kategori Populer dalam Satu Baris */}
        <View style={styles.categoriesRow}>
          {popularCategories.map((cat) => (
            <CategoryButton
              key={cat.value}
              value={cat.value}
              label={cat.label}
              width={categoryItemWidth}
              onPress={pressKategoriJasa}
            />
          ))}
        </View>

        {/* UI-04-09: Banner Ajakan Penyedia Jasa */}
        <Pressable
          testID="ui04-banner"
          onPress={handlePressBanner}
          accessibilityRole="button"
          accessibilityLabel={
            isPenyediaJasa
              ? 'Lihat pesanan jasamu di Riwayat Pekerjaan'
              : 'Daftar menjadi penyedia jasa'
          }
          style={({ pressed }) => [
            styles.bannerCard,
            pressed && styles.pressedOpacity,
          ]}
        >
          <View style={styles.bannerDecorOuter} pointerEvents="none" />
          <View style={styles.bannerDecorInner} pointerEvents="none" />

          <View style={styles.bannerTextColumn}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>
                {isPenyediaJasa ? 'PENYEDIA AKTIF' : 'PELUANG BARU'}
              </Text>
            </View>
            <Text style={styles.bannerTitle}>
              {isPenyediaJasa
                ? 'Lihat pesanan jasamu di Riwayat Pekerjaan'
                : 'Cari jasa, dapatkan penghasilan tambahan!'}
            </Text>
          </View>

          <View style={styles.bannerArrowCircle}>
            <Ionicons
              name="arrow-forward"
              size={22}
              color={UI_THEME.primary}
            />
          </View>
        </Pressable>

        {/* UI-04-10: Header Rekomendasi untuk Kamu */}
        <SectionHeader
          title="Rekomendasi untuk Kamu"
          onPressSeeAll={() =>
            navigation.navigate('SearchResult', {
              keyword: '',
              initialSort: 'rating_terbaik',
            })
          }
          seeAllAccessibilityLabel="Lihat semua rekomendasi penyedia jasa"
        />

        {/* UI-04-11: Daftar Horizontal Kartu Rekomendasi */}
        {isLoadingRecommendations ? (
          <View style={styles.skeletonRow}>
            {[0, 1].map((item) => (
              <View
                key={item}
                style={[
                  styles.recommendationSkeletonCard,
                  { width: recommendationCardWidth },
                ]}
              >
                <View style={styles.skeletonIllustration} />
                <View style={styles.skeletonLineWide} />
                <View style={styles.skeletonLineNarrow} />
              </View>
            ))}
          </View>
        ) : recommendationError ? (
          <View style={styles.recommendationErrorCard}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={UI_THEME.error}
            />
            <Text style={styles.recommendationErrorText}>
              {recommendationError}
            </Text>
            <Pressable
              onPress={() => {
                void refresh();
              }}
              accessibilityRole="button"
              accessibilityLabel="Coba muat ulang rekomendasi"
            >
              <Text style={styles.retryLinkText}>Coba lagi</Text>
            </Pressable>
          </View>
        ) : recommendations.length === 0 ? (
          <View style={styles.recommendationEmptyBox}>
            <Text style={styles.recommendationEmptyText}>
              Belum ada rekomendasi jasa di sekitarmu.
            </Text>
          </View>
        ) : (
          <FlatList
            data={recommendations}
            keyExtractor={(item) => item.idPemberiJasa}
            renderItem={renderRecommendationItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationListContent}
          />
        )}

        {/* UI-04-12: Header On Progress */}
        <SectionHeader
          title="On Progress"
          onPressSeeAll={handleOpenRiwayat}
          seeAllAccessibilityLabel="Lihat semua pesanan berjalan di Riwayat"
        />

        {/* UI-04-13: Kartu Pesanan On Progress */}
        <OnProgressCard
          activeOrder={activeOrder}
          onPressOrder={handleOpenRiwayat}
        />

        {/* UI-04-14: Navigasi Bawah disediakan oleh BottomTabNavigator */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: UI_THEME.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  pressedOpacity: {
    opacity: 0.78,
  },
  brandHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: UI_THEME.textTitle,
    lineHeight: 28,
  },
  brandTitleAccent: {
    color: UI_THEME.primary,
  },
  brandTagline: {
    fontSize: 9,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    letterSpacing: 0.5,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5A142',
    borderWidth: 1.5,
    borderColor: UI_THEME.background,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  greetingTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  greetingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: UI_THEME.textTitle,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 13.5,
    color: UI_THEME.textMuted,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F5F1',
    borderWidth: 2,
    borderColor: '#C5E8E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '800',
    color: UI_THEME.textTitle,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    marginBottom: 22,
  },
  searchLeadingIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: UI_THEME.textMuted,
  },
  searchActionSquare: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: UI_THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: UI_THEME.textTitle,
  },
  seeAllButton: {
    paddingVertical: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: UI_THEME.primary,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryTile: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    textAlign: 'center',
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1F9E89',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerDecorOuter: {
    position: 'absolute',
    right: -18,
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  bannerDecorInner: {
    position: 'absolute',
    right: 6,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
  },
  bannerTextColumn: {
    flex: 1,
    marginRight: 16,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5A142',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  bannerArrowCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendationListContent: {
    gap: 12,
    paddingBottom: 22,
  },
  recommendationCard: {
    backgroundColor: UI_THEME.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    padding: 10,
  },
  recommendationIllustration: {
    height: 96,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5A142',
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 3,
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  recommendationTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: UI_THEME.textTitle,
    marginBottom: 2,
  },
  recommendationSubtitle: {
    fontSize: 12.5,
    color: UI_THEME.textMuted,
    marginBottom: 10,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availabilityOnlineText: {
    color: UI_THEME.primary,
  },
  availabilityOfflineText: {
    color: UI_THEME.textMuted,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  recommendationSkeletonCard: {
    backgroundColor: UI_THEME.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    padding: 10,
  },
  skeletonIllustration: {
    height: 96,
    borderRadius: 12,
    backgroundColor: '#E5E9EC',
    marginBottom: 10,
  },
  skeletonLineWide: {
    height: 14,
    width: '75%',
    borderRadius: 6,
    backgroundColor: '#E5E9EC',
    marginBottom: 8,
  },
  skeletonLineNarrow: {
    height: 12,
    width: '50%',
    borderRadius: 6,
    backgroundColor: '#EDF1F3',
  },
  recommendationErrorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.errorBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 22,
    gap: 8,
  },
  recommendationErrorText: {
    flex: 1,
    fontSize: 13,
    color: UI_THEME.error,
  },
  retryLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: UI_THEME.primary,
  },
  recommendationEmptyBox: {
    backgroundColor: UI_THEME.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 22,
  },
  recommendationEmptyText: {
    fontSize: 13,
    color: UI_THEME.textMuted,
    textAlign: 'center',
  },
  onProgressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    padding: 14,
  },
  onProgressIconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FDF1E3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  onProgressTextColumn: {
    flex: 1,
    marginRight: 8,
  },
  onProgressTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: UI_THEME.textTitle,
    marginBottom: 2,
  },
  onProgressDate: {
    fontSize: 12.5,
    color: UI_THEME.textMuted,
  },
  onProgressEmptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    padding: 14,
  },
  onProgressEmptyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  onProgressEmptyText: {
    flex: 1,
    fontSize: 13,
    color: UI_THEME.textMuted,
  },
});

export default HomeView;
