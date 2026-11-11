/**
 * [Naufal Hasbialhaq] UI-16 Daftar Penyedia Jasa
 * Traceability: UC01 Mendaftarkan Jasa (Skenario Normal & Skenario Alternatif 1), KF04, KF05,
 * Kelas DPPL C14 KategoriJasaUI, C05 PemberiJasaUI, C15 KategoriJasaController,
 * Antarmuka UI-16 (UI-16-01 s.d. UI-16-07) -> Pengalihan ke UI-12 (Riwayat Pekerjaan)
 */

import React, { useRef } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Header, UI_THEME } from '../../components/Header';
import { InputField, InputFieldHandle } from '../../components/InputField';
import { Button } from '../../components/Button';
import {
  JENIS_JASA_OPTIONS,
  JenisJasa,
} from '../../services/serviceCatalogService';
import {
  FORM_LIMITS,
  PendaftaranJasaField,
  formatRupiah,
  isMinimalFilled,
  sanitizeJamInput,
  sanitizeTarifInput,
  useCatalogController,
} from '../../controllers/useCatalogController';

export const ServiceRegistrationView: React.FC = () => {
  const navigation = useNavigation();
  const {
    isPenyediaJasa,
    form,
    errors,
    isSubmitting,
    serverError,
    successResult,
    coordinates,
    locationStatus,
    detectCoordinates,
    setFieldValue,
    handleBlur,
    validateBeforeSubmit,
    submitRegistration,
    dismissServerError,
    dismissSuccessModal,
  } = useCatalogController();

  const scrollViewRef =
    useRef<React.ComponentRef<typeof ScrollView>>(null);

  const fieldRefs = useRef<
    Partial<Record<PendaftaranJasaField, InputFieldHandle | null>>
  >({});

  const fieldOffsets = useRef<Partial<Record<PendaftaranJasaField, number>>>(
    {}
  );

  const registerFieldLayout =
    (fields: PendaftaranJasaField[]) => (event: LayoutChangeEvent) => {
      const y = event.nativeEvent.layout.y;
      for (const f of fields) {
        fieldOffsets.current[f] = y;
      }
    };

  const focusField = (field: PendaftaranJasaField) => {
    const targetY = fieldOffsets.current[field];
    if (typeof targetY === 'number') {
      scrollViewRef.current?.scrollTo({
        y: Math.max(targetY - 24, 0),
        animated: true,
      });
    }
    setTimeout(() => {
      fieldRefs.current[field]?.focus();
    }, 150);
  };

  const handlePressSubmit = async () => {
    const validation = validateBeforeSubmit();

    if (!validation.isValid) {
      const invalidCount = Object.keys(validation.errors).length;
      AccessibilityInfo.announceForAccessibility(
        `Periksa kembali ${invalidCount} isian yang belum valid`
      );
      if (validation.firstInvalidField) {
        focusField(validation.firstInvalidField);
      }
      return;
    }

    Keyboard.dismiss();
    const result = await submitRegistration();
    if (!result) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleConfirmSuccess = () => {
    dismissSuccessModal();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Riwayat' } }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* UI-16-01 & UI-16-02: Tombol Kembali, Judul, dan Subjudul */}
          <Header
            title="Daftar Penyedia Jasa"
            subtitle="Lengkapi data untuk mulai menerima pesanan"
            onBackPress={() => navigation.goBack()}
            testID="ui16-header"
          />

          {/* Info jika akun sudah berstatus PEMBERI_JASA */}
          {isPenyediaJasa && !successResult ? (
            <View style={styles.infoBanner} testID="ui16-provider-info">
              <Ionicons
                name="information-circle"
                size={20}
                color={UI_THEME.primary}
                style={styles.infoBannerIcon}
              />
              <Text style={styles.infoBannerText}>
                Akunmu sudah terdaftar sebagai penyedia jasa. Mengirim ulang
                akan memperbarui data layananmu.
              </Text>
            </View>
          ) : null}

          {/* Banner Error Server / Jaringan */}
          {serverError ? (
            <View style={styles.errorBanner} testID="ui16-server-error">
              <Ionicons
                name="warning"
                size={20}
                color={UI_THEME.error}
                style={styles.errorBannerIcon}
              />
              <Text style={styles.errorBannerText}>{serverError}</Text>
              <Pressable
                onPress={dismissServerError}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Tutup pesan kesalahan"
              >
                <Ionicons name="close" size={18} color={UI_THEME.error} />
              </Pressable>
            </View>
          ) : null}

          {/* UI-16-03 & UI-16-04: Nama Toko / Penyedia Jasa */}
          <View onLayout={registerFieldLayout(['namaToko'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.namaToko = el;
              }}
              label="Nama Toko / Penyedia Jasa"
              placeholder="Masukkan nama toko atau usahamu"
              iconName="storefront-outline"
              value={form.namaToko}
              onChangeText={(text) => setFieldValue('namaToko', text)}
              onBlur={() => handleBlur('namaToko')}
              maxLength={FORM_LIMITS.namaTokoMax}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => fieldRefs.current.jenisJasa?.open()}
              error={errors.namaToko}
              testID="ui16-nama-toko"
            />
          </View>

          {/* UI-16-05 & UI-16-06: Dropdown Jenis Jasa */}
          <View onLayout={registerFieldLayout(['jenisJasa'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.jenisJasa = el;
              }}
              label="Jenis Jasa"
              type="select"
              placeholder="Pilih jenis jasa yang ditawarkan"
              iconName="construct-outline"
              value={form.jenisJasa}
              options={JENIS_JASA_OPTIONS}
              onSelectOption={(val) =>
                setFieldValue('jenisJasa', val as JenisJasa)
              }
              error={errors.jenisJasa}
              testID="ui16-jenis-jasa"
            />
          </View>

          {/* Deskripsi Jasa */}
          <View onLayout={registerFieldLayout(['deskripsiJasa'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.deskripsiJasa = el;
              }}
              label="Deskripsi Jasa"
              placeholder="Ceritakan keahlian, pengalaman, dan layanan yang kamu tawarkan"
              iconName="document-text-outline"
              value={form.deskripsiJasa}
              onChangeText={(text) => setFieldValue('deskripsiJasa', text)}
              onBlur={() => handleBlur('deskripsiJasa')}
              multiline
              numberOfLines={4}
              maxLength={FORM_LIMITS.deskripsiMax}
              showCounter
              error={errors.deskripsiJasa}
              testID="ui16-deskripsi"
            />
          </View>

          {/* Estimasi Tarif Dasar */}
          <View onLayout={registerFieldLayout(['tarif'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.tarif = el;
              }}
              label="Estimasi Tarif Dasar"
              placeholder="75.000"
              prefix="Rp"
              keyboardType="number-pad"
              value={formatRupiah(form.tarif)}
              onChangeText={(text) =>
                setFieldValue('tarif', sanitizeTarifInput(text))
              }
              onBlur={() => handleBlur('tarif')}
              returnKeyType="next"
              onSubmitEditing={() => fieldRefs.current.jamMulai?.focus()}
              helperText="Tarif awal sebelum negosiasi dengan pelanggan"
              error={errors.tarif}
              testID="ui16-tarif"
            />
          </View>

          {/* Jam Kerja (Mulai & Selesai) */}
          <View
            style={styles.timeSection}
            onLayout={registerFieldLayout(['jamMulai', 'jamSelesai'])}
          >
            <Text style={styles.sectionLabel}>Jam Kerja</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeCol}>
                <InputField
                  ref={(el) => {
                    fieldRefs.current.jamMulai = el;
                  }}
                  label="Mulai"
                  placeholder="08:00"
                  iconName="time-outline"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={form.jamMulai}
                  onChangeText={(text) =>
                    setFieldValue('jamMulai', sanitizeJamInput(text))
                  }
                  onBlur={() => handleBlur('jamMulai')}
                  returnKeyType="next"
                  onSubmitEditing={() => fieldRefs.current.jamSelesai?.focus()}
                  error={errors.jamMulai}
                  containerStyle={styles.timeInputContainer}
                  testID="ui16-jam-mulai"
                />
              </View>

              <View style={styles.timeCol}>
                <InputField
                  ref={(el) => {
                    fieldRefs.current.jamSelesai = el;
                  }}
                  label="Selesai"
                  placeholder="17:00"
                  iconName="time-outline"
                  keyboardType="number-pad"
                  maxLength={5}
                  value={form.jamSelesai}
                  onChangeText={(text) =>
                    setFieldValue('jamSelesai', sanitizeJamInput(text))
                  }
                  onBlur={() => handleBlur('jamSelesai')}
                  returnKeyType="next"
                  onSubmitEditing={() => fieldRefs.current.daerahKerja?.focus()}
                  error={errors.jamSelesai}
                  containerStyle={styles.timeInputContainer}
                  testID="ui16-jam-selesai"
                />
              </View>
            </View>
          </View>

          {/* Wilayah / Lokasi Kerja */}
          <View onLayout={registerFieldLayout(['daerahKerja'])}>
            <InputField
              ref={(el) => {
                fieldRefs.current.daerahKerja = el;
              }}
              label="Wilayah / Lokasi Kerja"
              placeholder="Contoh: Coblong, Dago, Bandung Utara"
              iconName="location-outline"
              value={form.daerahKerja}
              onChangeText={(text) => setFieldValue('daerahKerja', text)}
              onBlur={() => handleBlur('daerahKerja')}
              maxLength={FORM_LIMITS.daerahMax}
              returnKeyType="done"
              onSubmitEditing={handlePressSubmit}
              error={errors.daerahKerja}
              testID="ui16-daerah"
            />
          </View>

          {/* Status & Deteksi Koordinat GPS (latitude / longitude) */}
          <View style={styles.gpsCard} testID="ui16-gps-status">
            {locationStatus === 'loading' ? (
              <View style={styles.gpsRow}>
                <ActivityIndicator
                  size="small"
                  color={UI_THEME.primary}
                  style={styles.gpsIcon}
                />
                <Text style={styles.gpsText}>
                  Mendeteksi titik koordinat GPS perangkat...
                </Text>
              </View>
            ) : coordinates ? (
              <View style={styles.gpsRow}>
                <Ionicons
                  name="navigate-circle"
                  size={20}
                  color={UI_THEME.primary}
                  style={styles.gpsIcon}
                />
                <View style={styles.gpsTextWrap}>
                  <Text style={styles.gpsTitle}>Titik Koordinat Terdeteksi</Text>
                  <Text style={styles.gpsCoordsText}>
                    Lat: {coordinates.latitude}, Lng: {coordinates.longitude}
                  </Text>
                </View>
                <Pressable
                  onPress={detectCoordinates}
                  style={styles.gpsButton}
                  accessibilityRole="button"
                  accessibilityLabel="Perbarui koordinat GPS"
                  testID="ui16-gps-refresh"
                >
                  <Ionicons
                    name="refresh"
                    size={14}
                    color={UI_THEME.primary}
                  />
                  <Text style={styles.gpsButtonText}>Perbarui</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.gpsRow}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={UI_THEME.textMuted}
                  style={styles.gpsIcon}
                />
                <View style={styles.gpsTextWrap}>
                  <Text style={styles.gpsText}>
                    {locationStatus === 'denied'
                      ? 'Izin lokasi ditolak. Aktifkan izin lokasi jika ingin menyimpan koordinat GPS.'
                      : locationStatus === 'error'
                      ? 'Gagal mendeteksi koordinat. Pastikan GPS aktif lalu coba lagi.'
                      : 'Tekan "Deteksi GPS" untuk menandai koordinat lokasi saat ini (opsional).'}
                  </Text>
                </View>
                <Pressable
                  onPress={detectCoordinates}
                  style={styles.gpsButton}
                  accessibilityRole="button"
                  accessibilityLabel="Deteksi koordinat GPS"
                  testID="ui16-gps-detect"
                >
                  <Ionicons
                    name="locate"
                    size={14}
                    color={UI_THEME.primary}
                  />
                  <Text style={styles.gpsButtonText}>Deteksi GPS</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>

        {/* UI-16-07: Tombol Ajukan Pendaftaran */}
        <View style={styles.footer}>
          <Button
            title="Ajukan Pendaftaran"
            onPress={handlePressSubmit}
            disabled={!isMinimalFilled(form) || isSubmitting}
            loading={isSubmitting}
            testID="ui16-submit"
          />
        </View>
      </KeyboardAvoidingView>

      {/* Dialog Sukses Pendaftaran Penyedia Jasa -> Redirect ke UI-12 */}
      <Modal
        visible={Boolean(successResult)}
        transparent
        animationType="fade"
        onRequestClose={handleConfirmSuccess}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard} testID="ui16-success-dialog">
            <View style={styles.successIconCircle}>
              <Ionicons
                name="checkmark-circle"
                size={64}
                color={UI_THEME.primary}
              />
            </View>
            <Text style={styles.modalTitle}>Pendaftaran Berhasil</Text>
            <Text style={styles.modalMessage}>
              "{form.namaToko.trim()}" kini terdaftar sebagai penyedia jasa{' '}
              {form.jenisJasa}. Kamu siap menerima pesanan!
            </Text>
            <View style={styles.modalButtonWrap}>
              <Button
                title="Lihat Riwayat Pekerjaan"
                onPress={handleConfirmSuccess}
                testID="ui16-success-confirm"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: UI_THEME.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F7F4',
    borderLeftWidth: 4,
    borderLeftColor: UI_THEME.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  infoBannerIcon: {
    marginRight: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: UI_THEME.textTitle,
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: UI_THEME.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: UI_THEME.error,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  errorBannerIcon: {
    marginRight: 10,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: UI_THEME.error,
    fontWeight: '600',
    marginRight: 8,
  },
  timeSection: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeCol: {
    flex: 1,
  },
  timeInputContainer: {
    marginBottom: 0,
  },
  gpsCard: {
    backgroundColor: UI_THEME.surface,
    borderWidth: 1,
    borderColor: UI_THEME.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: -6,
    marginBottom: 8,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsIcon: {
    marginRight: 10,
  },
  gpsTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    marginBottom: 2,
  },
  gpsCoordsText: {
    fontSize: 12,
    color: UI_THEME.primary,
    fontWeight: '600',
  },
  gpsText: {
    flex: 1,
    fontSize: 12,
    color: UI_THEME.textMuted,
    lineHeight: 17,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F7F4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  gpsButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: UI_THEME.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: UI_THEME.background,
    borderTopWidth: 1,
    borderTopColor: UI_THEME.border,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: UI_THEME.surface,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
  },
  successIconCircle: {
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: UI_THEME.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtonWrap: {
    width: '100%',
  },
});

export default ServiceRegistrationView;
