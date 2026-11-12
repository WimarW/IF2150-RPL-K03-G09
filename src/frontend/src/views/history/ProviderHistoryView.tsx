/**
 * UI-12 Riwayat Pekerjaan Penyedia — Kelas DPPL C05 PemberiJasaUI
 * Traceability: UC01 (Tujuan pengalihan setelah pendaftaran penyedia jasa berhasil),
 * UC04, UC06, Antarmuka UI-12
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UI_THEME } from '../../components/Header';
import { useSessionUser } from '../../services/api';
import {
  getAllCachedContracts,
  subscribeContracts,
} from '../../services/contractService';
import { ContractRecord } from '../../types/chat';

export const ProviderHistoryView: React.FC = () => {
  const { user } = useSessionUser();
  const [activeContracts, setActiveContracts] = useState<ContractRecord[]>(() =>
    getAllCachedContracts().filter(
      (c) => c.statusPekerjaan === 'On Progress' || c.status === 'DITERIMA'
    )
  );

  useEffect(() => {
    const sync = () => {
      setActiveContracts(
        getAllCachedContracts().filter(
          (c) => c.statusPekerjaan === 'On Progress' || c.status === 'DITERIMA'
        )
      );
    };
    sync();
    return subscribeContracts(sync);
  }, []);

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

      {activeContracts.length > 0 ? (
        <View style={styles.listWrap} testID="ui12-active-contracts-list">
          {activeContracts.map((item) => (
            <View key={item.idKontrak} style={styles.contractItemCard}>
              <View style={styles.contractTopRow}>
                <Text style={styles.contractTitle}>{item.jasa}</Text>
                <View style={styles.onProgressPill}>
                  <Text style={styles.onProgressPillText}>
                    {item.statusPekerjaan || 'On Progress'}
                  </Text>
                </View>
              </View>
              <Text style={styles.contractDesc}>{item.deskripsi}</Text>
              <Text style={styles.contractPrice}>
                Rp {Number(item.totalHarga ?? 0).toLocaleString('id-ID')}
              </Text>
            </View>
          ))}
        </View>
      ) : (
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
      )}
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
  listWrap: {
    gap: 12,
  },
  contractItemCard: {
    backgroundColor: UI_THEME.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    padding: 16,
  },
  contractTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  contractTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  onProgressPill: {
    backgroundColor: '#E8F7F4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  onProgressPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: UI_THEME.primary,
  },
  contractDesc: {
    fontSize: 13,
    color: UI_THEME.textMuted,
    marginBottom: 8,
  },
  contractPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: UI_THEME.primary,
  },
});

export default ProviderHistoryView;
