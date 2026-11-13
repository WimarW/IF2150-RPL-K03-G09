import React from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareView } from '../../components/common/KeyboardAwareView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  getRatingTagOptions,
  useRatingController,
} from '../../controllers/useRatingController';
import { getInitialsFromName, RaterRole } from '../../services/ratingService';
import { RootStackParamList } from '../../navigation/types';

export interface RatingFormProps {
  idKontrakPekerjaan: string;
  idPenggunaPemberi?: string;
  idPenggunaPenerima: string;
  namaPenerima: string;
  inisialPenerima?: string;
  detailPekerjaan: string;
  initialStars?: number;
  token?: string;
  /**
   * Peran pemberi rating. `PELANGGAN` (default) menilai penyedia jasa,
   * `PEMBERI_JASA` menilai pelanggan (UC10 dua arah) dengan teks & tag yang disesuaikan.
   */
  raterRole?: RaterRole;
  /** true bila form dirender di dalam RatingModal (memengaruhi penanganan keyboard Android) */
  insideModal?: boolean;
  onCancel: () => void;
  onSuccess: (result: {
    idKontrakPekerjaan: string;
    nilaiRating: number;
    ulasan: string;
    tags: string[];
    message: string;
  }) => void;
}

/**
 * Komponen utama layar Beri Penilaian (`UI-11` / Kelas DPPL `C26 RatingUI`).
 * Mengimplementasikan seluruh elemen UI-11-01 s.d. UI-11-08 sesuai spesifikasi DPPL2 Tabel 6.11 & UI-11.svg.
 */
export const RatingFormContent: React.FC<RatingFormProps> = ({
  idKontrakPekerjaan,
  idPenggunaPemberi = 'pelanggan-001',
  idPenggunaPenerima,
  namaPenerima,
  inisialPenerima,
  detailPekerjaan,
  initialStars = 0,
  token,
  raterRole = 'PELANGGAN',
  insideModal = false,
  onCancel,
  onSuccess,
}) => {
  const isProviderRater = raterRole === 'PEMBERI_JASA';
  const tagOptions = getRatingTagOptions(raterRole);
  const {
    nilaiRating,
    ulasan,
    selectedTags,
    predikatLabel,
    canSubmit,
    isSubmitting,
    errorMessage,
    pressJumlahBintang,
    onChangeUlasan,
    pressTagChip,
    pressBatalRating,
    pressSubmitRating,
  } = useRatingController({
    idKontrakPekerjaan,
    idPenggunaPemberi,
    idPenggunaPenerima,
    namaPenerima,
    detailPekerjaan,
    initialStars,
    token,
    onCancel,
    onSuccess,
  });

  const avatarInitials =
    inisialPenerima ||
    getInitialsFromName(namaPenerima || (isProviderRater ? 'Pelanggan' : 'Mitra Jasa'));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAwareView
        style={styles.keyboardContainer}
        includeBottomInset={false}
        insideModal={insideModal}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* UI-11-01: Tombol Kembali (`‹ Kembali`) */}
          <TouchableOpacity
            testID="UI-11-01-back-button"
            style={styles.backButton}
            onPress={pressBatalRating}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              isProviderRater ? 'Kembali ke Riwayat Pekerjaan' : 'Kembali ke Riwayat'
            }
          >
            <Text style={styles.backButtonText}>‹ Kembali</Text>
          </TouchableOpacity>

          {/* UI-11-02: Header Judul & Subjudul */}
          <View testID="UI-11-02-header" style={styles.headerSection}>
            <Text style={styles.headerTitle}>Beri Penilaian</Text>
            <Text style={styles.headerSubtitle}>
              {isProviderRater
                ? 'Bagaimana pengalamanmu bekerja dengan pelanggan ini?'
                : 'Bagaimana pengalaman kerjamu?'}
            </Text>
          </View>

          {/* UI-11-03: Kartu Identitas Lawan Transaksi & Pekerjaan */}
          <View testID="UI-11-03-job-card" style={styles.jobInfoCard}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarInitialsText}>{avatarInitials}</Text>
            </View>
            <View style={styles.jobInfoTextColumn}>
              <Text style={styles.providerNameText} numberOfLines={1}>
                {namaPenerima}
              </Text>
              {isProviderRater ? (
                <Text style={styles.roleLabelText}>Pelanggan</Text>
              ) : null}
              <Text style={styles.jobDetailText} numberOfLines={2}>
                {detailPekerjaan}
              </Text>
            </View>
          </View>

          {/* UI-11-04 & UI-11-05: Rating Bar 5 Bintang Interaktif & Label Predikat Dinamis */}
          <View style={styles.ratingCenterSection}>
            <View testID="UI-11-04-star-bar" style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((starNumber) => {
                const isSelected = starNumber <= nilaiRating;
                return (
                  <TouchableOpacity
                    key={starNumber}
                    testID={`UI-11-04-star-${starNumber}`}
                    style={styles.starTouchTarget}
                    onPress={() => pressJumlahBintang(starNumber)}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityLabel={`Bintang ${starNumber}`}
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Ionicons
                      name={isSelected ? 'star' : 'star-outline'}
                      size={40}
                      color={isSelected ? '#F4A340' : '#D5E1DD'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* UI-11-05: Teks Predikat Skor Dinamis */}
            <Text
              testID="UI-11-05-predicate-label"
              style={[
                styles.predicateText,
                nilaiRating === 0 && styles.predicatePlaceholderText,
              ]}
            >
              {predikatLabel}
            </Text>
          </View>

          {/* UI-11-06: Text Area Ulasan Pengalaman (Opsional) */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Ulasan (Opsional)</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                testID="UI-11-06-review-input"
                style={styles.textAreaInput}
                placeholder={
                  isProviderRater
                    ? 'Ceritakan pengalamanmu melayani pelanggan ini...'
                    : 'Ceritakan pengalamanmu selama menggunakan jasa ini...'
                }
                placeholderTextColor="#A2B1C1"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={ulasan}
                onChangeText={onChangeUlasan}
                maxLength={500}
              />
            </View>
          </View>

          {/* UI-11-07: Chip Tag Multi-Pilih (Opsional) */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Beri Tag (Opsional)</Text>
            <View testID="UI-11-07-tag-group" style={styles.tagsRow}>
              {tagOptions.map((tag) => {
                const isTagSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    testID={`UI-11-07-tag-${tag}`}
                    style={[
                      styles.tagChip,
                      isTagSelected && styles.tagChipSelected,
                    ]}
                    onPress={() => pressTagChip(tag)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isTagSelected }}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        isTagSelected && styles.tagChipTextSelected,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color="#C93636" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
        </ScrollView>

        {/* UI-11-08: Tombol "Kirim Penilaian" */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            testID="UI-11-08-submit-button"
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
            ]}
            onPress={pressSubmitRating}
            disabled={!canSubmit}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSubmit }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Kirim Penilaian</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareView>
    </SafeAreaView>
  );
};

export interface RatingModalProps extends RatingFormProps {
  visible: boolean;
}

/**
 * Dialog Popup / Modal Beri Penilaian (`UI-11`) yang muncul otomatis saat pesanan selesai
 * dikonfirmasi (`UC10` Skenario Normal) atau saat dibuka dari layar Riwayat (`UC10` Skenario Alternatif 1).
 */
export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  ...formProps
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={formProps.onCancel}
    >
      <RatingFormContent {...formProps} insideModal />
    </Modal>
  );
};

/**
 * Layar Stack Navigator `Rating` (`UI-11`) untuk navigasi langsung via React Navigation.
 */
export const RatingView: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Rating'>>();

  const params: RootStackParamList['Rating'] = route.params ?? {
    idKontrakPekerjaan: 'kontrak-001',
    idPenggunaPenerima: 'penyedia-budi-001',
    namaPenerima: 'Budi Wijaya',
    inisialPenerima: 'BW',
    detailPekerjaan: 'Bersih-bersih Rumah · 2 Jam',
  };

  return (
    <RatingFormContent
      idKontrakPekerjaan={params.idKontrakPekerjaan}
      idPenggunaPenerima={params.idPenggunaPenerima}
      namaPenerima={params.namaPenerima}
      inisialPenerima={params.inisialPenerima}
      detailPekerjaan={params.detailPekerjaan}
      initialStars={params.initialStars}
      raterRole={params.raterRole}
      onCancel={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
      onSuccess={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9F8',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 14,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#153B65',
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#153B65',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#7C8CA0',
  },
  jobInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9F0ED',
    padding: 16,
    minHeight: 80,
    marginBottom: 32,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#DDF5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarInitialsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153B65',
  },
  jobInfoTextColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  providerNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#153B65',
    marginBottom: 4,
  },
  roleLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#20AE9B',
    marginBottom: 2,
  },
  jobDetailText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#7C8CA0',
  },
  ratingCenterSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  starTouchTarget: {
    padding: 4,
  },
  predicateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#153B65',
    textAlign: 'center',
  },
  predicatePlaceholderText: {
    color: '#7C8CA0',
    fontWeight: '500',
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#153B65',
    marginBottom: 12,
  },
  textAreaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9F0ED',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 120,
  },
  textAreaInput: {
    fontSize: 13,
    color: '#153B65',
    minHeight: 92,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#DDF5EE',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagChipSelected: {
    backgroundColor: '#20AE9B',
    borderColor: '#158878',
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#20AE9B',
  },
  tagChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBE7E7',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginTop: 4,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#C93636',
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: '#F7F9F8',
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#20AE9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.45,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default RatingView;
