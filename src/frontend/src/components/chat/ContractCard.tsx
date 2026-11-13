/**
 * Komponen Kartu & Form Interaktif Kontrak Pekerjaan (Kelas DPPL C17 KontrakPekerjaanUI)
 * Traceability:
 * - UC05 (Pelanggan memasukkan kesepakatan harga dan pekerjaan)
 * - Antarmuka UI-08 (Ruang Obrolan Pelanggan: UI-08-04, UI-08-05, UI-08-09)
 * - Antarmuka UI-09 (Ruang Obrolan Penyedia Jasa: UI-09-06, UI-09-07, UI-09-08, UI-09-09)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import {
  ContractCardStatus,
  ContractFormErrors,
  ContractFormValues,
  DummyContract,
} from '../../types/chat';
import {
  formatHargaRibuan,
  sanitizeHargaInput,
  showKontrakForm,
  validateContractForm,
} from '../../controllers/useContractController';

export interface ContractCardProps {
  variant: 'create' | 'detail' | 'decision';
  contract?: DummyContract;
  formValues?: ContractFormValues;
  formErrors?: ContractFormErrors;
  isSubmitting?: boolean;
  onChangeField?: (field: keyof ContractFormValues, value: string) => void;
  onCreate?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const DEFAULT_CONTRACT: DummyContract = {
  idKontrak: 'kontrak-1',
  jasa: 'Bersih-bersih Rumah',
  deskripsi: 'Bersihin rumah wimar',
  totalHarga: 100000,
  status: 'MENUNGGU',
  statusPekerjaan: 'Menunggu',
  waktu: '14.28',
};

function getBadgeConfig(status: ContractCardStatus): {
  label: string;
  bgColor: string;
  textColor: string;
} {
  switch (status) {
    case 'DITERIMA':
      return {
        label: 'Diterima',
        bgColor: colors.mint,
        textColor: colors.primary,
      };
    case 'DITOLAK':
      return {
        label: 'Ditolak',
        bgColor: colors.dangerBg,
        textColor: colors.danger,
      };
    case 'MENUNGGU':
    default:
      return {
        label: 'Menunggu',
        bgColor: colors.warningBg,
        textColor: colors.warning,
      };
  }
}

export const ContractCard: React.FC<ContractCardProps> = React.memo(
  ({
    variant,
    contract = DEFAULT_CONTRACT,
    formValues,
    formErrors,
    isSubmitting = false,
    onChangeField,
    onCreate,
    onAccept,
    onReject,
  }) => {
    // Fallback state apabila komponen dirender tanpa prop formValues dari luar
    const [localForm, setLocalForm] = useState<ContractFormValues>(() =>
      showKontrakForm(
        contract.jasa,
        contract.deskripsi,
        contract.totalHarga ?? 100000
      )
    );
    const [localErrors, setLocalErrors] = useState<ContractFormErrors>({});

    useEffect(() => {
      if (!formValues) {
        setLocalForm(
          showKontrakForm(
            contract.jasa,
            contract.deskripsi,
            contract.totalHarga ?? 100000
          )
        );
      }
    }, [contract.jasa, contract.deskripsi, contract.totalHarga, formValues]);

    const activeForm = formValues ?? localForm;
    const activeErrors = formErrors ?? localErrors;

    const handleFieldChange = (
      field: keyof ContractFormValues,
      value: string
    ) => {
      if (onChangeField) {
        onChangeField(field, value);
        return;
      }
      const nextVal =
        field === 'totalHarga' ? sanitizeHargaInput(value) : value;
      setLocalForm((prev) => ({ ...prev, [field]: nextVal }));
      setLocalErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    };

    const handlePressCreate = () => {
      if (!formValues) {
        const validation = validateContractForm(localForm);
        if (!validation.isValid) {
          setLocalErrors(validation.errors);
          return;
        }
        setLocalErrors({});
      }
      if (onCreate) {
        onCreate();
      }
    };

    const badge = getBadgeConfig(contract.status);
    const formattedDisplayHarga = formatHargaRibuan(activeForm.totalHarga);
    const firstError =
      activeErrors.jasa || activeErrors.deskripsi || activeErrors.totalHarga;

    // ========================================================================
    // UI-08-04 & UI-08-05: Form Input Kesepakatan "Buat Kontrak" (Pelanggan)
    // ========================================================================
    if (variant === 'create') {
      return (
        <View style={styles.createCard} testID="ui08-create-contract-card">
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <Feather
                name="file-text"
                size={16}
                color={colors.navy}
                style={styles.icon}
              />
              <Text style={styles.title}>Buat Kontrak</Text>
            </View>
          </View>

          {/* Input Nama Jenis Jasa (UI-08-04) */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Jasa</Text>
            <TextInput
              style={[
                styles.inlineInput,
                styles.inlineInputBold,
                activeErrors.jasa ? styles.inlineInputError : null,
              ]}
              value={activeForm.jasa}
              onChangeText={(text) => handleFieldChange('jasa', text)}
              placeholder="Nama jenis jasa..."
              placeholderTextColor={colors.textSecondary}
              editable={!isSubmitting}
              accessibilityLabel="Input nama jenis jasa"
              testID="ui08-input-jasa"
            />
          </View>

          {/* Input Deskripsi Pekerjaan (UI-08-04) */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Deskripsi</Text>
            <TextInput
              style={[
                styles.inlineInput,
                styles.inlineInputBold,
                activeErrors.deskripsi ? styles.inlineInputError : null,
              ]}
              value={activeForm.deskripsi}
              onChangeText={(text) => handleFieldChange('deskripsi', text)}
              placeholder="Rincian pekerjaan..."
              placeholderTextColor={colors.textSecondary}
              editable={!isSubmitting}
              accessibilityLabel="Input deskripsi pekerjaan"
              testID="ui08-input-deskripsi"
            />
          </View>

          {/* Input Total Harga Persetujuan (Rp) (UI-08-04) */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Total Harga</Text>
            <View
              style={[
                styles.priceInputContainer,
                activeErrors.totalHarga ? styles.inlineInputError : null,
              ]}
            >
              <Text style={styles.pricePrefix}>Rp </Text>
              <TextInput
                style={styles.priceInput}
                value={formattedDisplayHarga}
                onChangeText={(text) => handleFieldChange('totalHarga', text)}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                editable={!isSubmitting}
                accessibilityLabel="Input total harga persetujuan"
                testID="ui08-input-harga"
              />
            </View>
          </View>

          {firstError ? (
            <Text style={styles.errorText} testID="ui08-contract-error">
              {firstError}
            </Text>
          ) : null}

          {/* Tombol "Buat Kontrak" (UI-08-05) */}
          <TouchableOpacity
            style={[
              styles.outlineButton,
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={handlePressCreate}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Buat Kontrak"
            testID="ui08-submit-contract-button"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.navy} />
            ) : (
              <Text style={styles.outlineButtonText}>Buat Kontrak</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    // ========================================================================
    // UI-08-09 ("Detail Kontrak") & UI-09-06..09 ("Kontrak Pekerjaan")
    // ========================================================================
    const isDecision = variant === 'decision';
    const jobStatusText =
      contract.statusPekerjaan ||
      (contract.status === 'DITERIMA'
        ? 'On Progress'
        : contract.status === 'DITOLAK'
        ? 'Ditolak'
        : 'Menunggu');

    return (
      <View
        style={styles.timelineWrapper}
        testID={
          isDecision ? 'ui09-contract-card' : 'ui08-detail-contract-card'
        }
      >
        <View style={styles.streamCard}>
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <Feather
                name="file-text"
                size={16}
                color={colors.navy}
                style={styles.icon}
              />
              <Text style={styles.title}>
                {isDecision ? 'Kontrak Pekerjaan' : 'Detail Kontrak'}
              </Text>
            </View>

            {/* UI-08-09 & UI-09-07: Badge Status Kontrak */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: badge.bgColor },
              ]}
              testID={
                isDecision
                  ? 'ui09-contract-status-badge'
                  : 'ui08-contract-status-badge'
              }
            >
              <Text style={[styles.statusText, { color: badge.textColor }]}>
                {badge.label}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Jasa</Text>
            <Text style={styles.valueBold}>{contract.jasa}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Deskripsi</Text>
            <Text style={styles.valueBold}>{contract.deskripsi}</Text>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.priceRow}>
            <Text style={styles.label}>Total Harga</Text>
            <Text style={styles.priceValue}>
              Rp {Number(contract.totalHarga ?? 0).toLocaleString('id-ID')}
            </Text>
          </View>

          {/* Indikator Status Pekerjaan ketika kontrak telah Diterima -> On Progress */}
          {contract.status === 'DITERIMA' && (
            <View
              style={styles.progressBanner}
              testID="contract-job-status-banner"
            >
              <Feather
                name="check-circle"
                size={14}
                color={colors.primary}
                style={styles.bannerIcon}
              />
              <Text style={styles.progressBannerText}>
                Status Pekerjaan: {jobStatusText}
              </Text>
            </View>
          )}

          {contract.status === 'DITOLAK' && (
            <View
              style={styles.rejectedBanner}
              testID="contract-rejected-banner"
            >
              <Feather
                name="x-circle"
                size={14}
                color={colors.danger}
                style={styles.bannerIcon}
              />
              <Text style={styles.rejectedBannerText}>
                Kontrak ditolak oleh penyedia jasa
              </Text>
            </View>
          )}

          {/* UI-09-08 ("Tolak") & UI-09-09 ("Terima") hanya muncul saat status MENUNGGU */}
          {isDecision && contract.status === 'MENUNGGU' && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.rejectButton,
                  isSubmitting && styles.buttonDisabled,
                ]}
                onPress={onReject}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Tolak Kontrak"
                testID="ui09-reject-button"
              >
                <Text style={styles.rejectText}>Tolak</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.acceptButton,
                  isSubmitting && styles.buttonDisabled,
                ]}
                onPress={onAccept}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Terima Kontrak"
                testID="ui09-accept-button"
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.acceptText}>Terima</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {contract.waktu ? (
          <Text style={styles.timestampText}>{contract.waktu}</Text>
        ) : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  createCard: {
    backgroundColor: colors.slate100,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 6,
  },
  timelineWrapper: {
    marginVertical: 6,
    alignSelf: 'stretch',
  },
  streamCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    minWidth: 72,
  },
  inlineInput: {
    flex: 1,
    fontSize: 13,
    color: colors.navy,
    textAlign: 'right',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inlineInputBold: {
    fontWeight: '700',
  },
  inlineInputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  priceInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  pricePrefix: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  priceInput: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
    paddingVertical: 0,
    minWidth: 65,
  },
  valueBold: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
    textAlign: 'right',
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  errorText: {
    fontSize: 11.5,
    color: colors.danger,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '600',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.navy,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 22,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    backgroundColor: colors.white,
    minWidth: 120,
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.navy,
  },
  buttonDisabled: {
    opacity: 0.6,
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
    justifyContent: 'center',
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
    justifyContent: 'center',
    marginLeft: 6,
  },
  acceptText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  progressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mint,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  bannerIcon: {
    marginRight: 6,
  },
  progressBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  rejectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerBg,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  rejectedBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  timestampText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default ContractCard;
