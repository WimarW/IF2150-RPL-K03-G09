/**
 * Stub Komponen Integrasi Kontrak Pekerjaan (Slot milik Raymond / UC05)
 * TODO(Raymond): Ganti dengan implementasi asli dari useContractController
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { DummyContract } from '../../types/chat';

interface ContractCardProps {
  variant: 'create' | 'detail' | 'decision';
  contract?: DummyContract;
  onCreate?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

export const ContractCard: React.FC<ContractCardProps> = React.memo(({
  variant,
  contract = {
    idKontrak: 'kontrak-1',
    jasa: 'Bersih-bersih Rumah',
    deskripsi: 'Bersihin rumah wimar',
    totalHarga: 100000,
    status: 'MENUNGGU',
    waktu: '14.28',
  },
  onCreate,
  onAccept,
  onReject,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWithIcon}>
          <Feather name="file-text" size={16} color={colors.navy} style={styles.icon} />
          <Text style={styles.title}>
            {variant === 'create'
              ? 'Buat Kontrak'
              : variant === 'detail'
              ? 'Detail Kontrak'
              : 'Kontrak Pekerjaan'}
          </Text>
        </View>
        {variant === 'decision' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Menunggu</Text>
          </View>
        )}
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Jasa</Text>
        <Text style={styles.valueBold}>{contract.jasa}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Deskripsi</Text>
        <Text style={styles.value}>{contract.deskripsi}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.priceRow}>
        <Text style={styles.label}>Total Harga</Text>
        <Text style={styles.priceValue}>
          Rp {contract.totalHarga.toLocaleString('id-ID')}
        </Text>
      </View>

      {variant === 'create' && (
        <TouchableOpacity style={styles.outlineButton} onPress={onCreate}>
          <Text style={styles.outlineButtonText}>Buat Kontrak</Text>
        </TouchableOpacity>
      )}

      {variant === 'decision' && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
            <Text style={styles.rejectText}>Tolak</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptText}>Terima</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.slate100,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },
  statusBadge: {
    backgroundColor: colors.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.warning,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    color: colors.navy,
  },
  valueBold: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.navy,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: colors.white,
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rejectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 6,
    backgroundColor: colors.white,
  },
  rejectText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginLeft: 6,
  },
  acceptText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
});