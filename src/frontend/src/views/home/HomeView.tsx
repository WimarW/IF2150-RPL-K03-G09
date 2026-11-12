import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAuthController } from '../../controllers/useAuthController';
import { ScreenName } from '../../navigation/types';

export interface HomeViewProps {
  onNavigate: (screen: ScreenName) => void;
}

const POPULAR_CATEGORIES = [
  'Servis',
  'Kebersihan',
  'Jahit',
  'Renovasi',
  'Desain',
  'Lainnya',
];

/**
 * UI-04: Layar Beranda (Pelanggan)
 * Realisasi Kelas DPPL: C08 PelangganUI
 */
export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { user } = useAuthController();
  const displayName = user?.namaPengguna || 'User';
  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar: UI-04-01 Logo, UI-04-03 Sapaan, UI-04-04 Avatar menuju Profil Saya (UI-14) */}
      <View style={styles.headerRow}>
        <View style={styles.greetingBlock}>
          <Text style={styles.brandMini}>
            Cari<Text style={styles.brandMiniAccent}>Uang</Text>
          </Text>
          <Text style={styles.greetingTitle} testID="home-greeting-title">
            Halo, {displayName}! 👋
          </Text>
          <Text style={styles.greetingSubtitle}>
            Mau cari jasa atau peluang kerja hari ini?
          </Text>
        </View>

        <TouchableOpacity
          testID="home-profile-avatar-button"
          style={styles.avatarButton}
          onPress={() => onNavigate('Profile')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Buka Profil Saya"
        >
          <Text style={styles.avatarText}>{initials || 'CU'}</Text>
        </TouchableOpacity>
      </View>

      {/* UI-04-05: Search Bar */}
      <View style={styles.searchBarBox}>
        <Text style={styles.searchPlaceholder}>
          🔍  Cari jasa, pekerjaan, atau kategori...
        </Text>
      </View>

      {/* UI-04-07 & UI-04-08: Kategori Populer */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Kategori Populer</Text>
        <Text style={styles.sectionLink}>Lihat semua ›</Text>
      </View>

      <View style={styles.categoriesGrid}>
        {POPULAR_CATEGORIES.map((item) => (
          <View key={item} style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{item}</Text>
          </View>
        ))}
      </View>

      {/* UI-04-09: Banner Peluang Baru menuju Buat Akun Jasa (UI-03) */}
      <TouchableOpacity
        testID="home-provider-banner"
        style={styles.promoBanner}
        onPress={() => onNavigate('RegisterProvider')}
        activeOpacity={0.85}
      >
        <View style={styles.promoTextBlock}>
          <Text style={styles.promoTitle}>
            Peluang Baru: Cari jasa, dapatkan penghasilan tambahan!
          </Text>
          <Text style={styles.promoSub}>
            Daftar sebagai Penyedia Jasa di CariUang sekarang →
          </Text>
        </View>
      </TouchableOpacity>

      {/* UI-04-10 & UI-04-11: Rekomendasi untuk Kamu */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Rekomendasi untuk Kamu</Text>
        <Text style={styles.sectionLink}>Lihat semua ›</Text>
      </View>

      <View style={styles.recommendationCard}>
        <Text style={styles.recCardTitle}>Bersih Rumah</Text>
        <Text style={styles.recCardSubtitle}>
          Jasa kebersihan · Tersedia hari ini
        </Text>
      </View>

      <View style={styles.recommendationCard}>
        <Text style={styles.recCardTitle}>Servis Elektronik</Text>
        <Text style={styles.recCardSubtitle}>
          Teknisi profesional · Bisa buat janji
        </Text>
      </View>
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
    marginBottom: 20,
  },
  greetingBlock: {
    flex: 1,
    paddingRight: 12,
  },
  brandMini: {
    fontSize: 16,
    fontWeight: '800',
    color: '#13334C',
    marginBottom: 4,
  },
  brandMiniAccent: {
    color: '#14967F',
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#13334C',
  },
  greetingSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 2,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#DDF3EE',
    borderWidth: 1.5,
    borderColor: '#14967F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#13334C',
  },
  searchBarBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  sectionHeaderRow: {
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  categoryChipText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#13334C',
  },
  promoBanner: {
    backgroundColor: '#0F8A75',
    borderRadius: 16,
    padding: 18,
    marginBottom: 22,
  },
  promoTextBlock: {
    width: '100%',
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promoSub: {
    fontSize: 12.5,
    color: '#DDF3EE',
    fontWeight: '600',
  },
  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 12,
  },
  recCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#13334C',
    marginBottom: 4,
  },
  recCardSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
});

export default HomeView;
