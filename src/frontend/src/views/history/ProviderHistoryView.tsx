/**
 * UI-12 Riwayat Pekerjaan Penyedia — Kelas DPPL C05 PemberiJasaUI
 * Traceability: UC01 (Tujuan pengalihan setelah pendaftaran penyedia jasa berhasil),
 * UC04, UC06, Antarmuka UI-12
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UI_THEME } from '../../components/Header';
import { useSessionUser } from '../../services/api';

export const ProviderHistoryView: React.FC = () => {
  const { user } = useSessionUser();

  return (
    <View style={styles.container} testID="ui12-provider-history">
      <View style={styles.headerCard}>
        <View style={styles.badge}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={UI_THEME.primary}
          />
          <Text style={styles.badgeText}>Penyedia Jasa Aktif</Text>
        </View>
        <Text style={styles.title}>Riwayat Pekerjaan</Text>
        <Text style={styles.subtitle}>
          Halo, {user.namaPengguna}! Pesanan layanan yang masuk ke tokomu akan
          ditampilkan di halaman ini.
        </Text>
      </View>

      <View style={styles.emptyCard}>
        <Ionicons
          name="briefcase-outline"
          size={48}
          color={UI_THEME.primary}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>Belum Ada Riwayat Pekerjaan</Text>
        <Text style={styles.emptyDesc}>
          Profil layananmu sudah aktif dan siap ditemukan pelanggan. Pesanan
          pekerjaan baru maupun yang telah selesai akan tercatat di sini.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_THEME.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerCard: {
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F7F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: UI_THEME.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: UI_THEME.textMuted,
    lineHeight: 20,
  },
  emptyCard: {
    backgroundColor: UI_THEME.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 14,
    color: UI_THEME.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ProviderHistoryView;
