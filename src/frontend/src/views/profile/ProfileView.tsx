import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useAuthController } from '../../controllers/useAuthController';
import { ScreenName } from '../../navigation/types';

export interface ProfileViewProps {
  onBack: () => void;
  onLogoutSuccess: (loginScreen: ScreenName) => void;
}

const AVATAR_COLOR_PALETTE = [
  '#DDF3EE',
  '#DBEAFE',
  '#FEF3C7',
  '#FCE7F3',
  '#EDE9FE',
];

function getInitials(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'CU';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/**
 * UI-14: Layar Profil Saya
 * Realisasi Kelas DPPL: C02 PenggunaUI, C03 PenggunaController
 */
export const ProfileView: React.FC<ProfileViewProps> = ({
  onBack,
  onLogoutSuccess,
}) => {
  const {
    user,
    isLoading,
    validateRequiredName,
    validateEmailInstant,
    validatePasswordInstant,
    updateUserProfile,
    logoutSession,
  } = useAuthController();

  const [namaLengkap, setNamaLengkap] = useState<string>(
    user?.namaPengguna || 'Naufal Hasbialhaq'
  );
  const [email, setEmail] = useState<string>(
    user?.email || 'naufal.h@example.com'
  );
  const [password, setPassword] = useState<string>('password123');
  const [avatarBgIndex, setAvatarBgIndex] = useState<number>(0);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isLogoutModalVisible, setIsLogoutModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setNamaLengkap(user.namaPengguna);
      setEmail(user.email);
    }
  }, [user]);

  // Validasi instan (Acceptance Criteria)
  const nameValidation = validateRequiredName(namaLengkap);
  const emailValidation = validateEmailInstant(email, false);
  const passwordValidation = validatePasswordInstant(password);

  const isFormValid =
    nameValidation.isValid &&
    emailValidation.isValid &&
    passwordValidation.isValid;

  const hasChanges =
    Boolean(user) &&
    (namaLengkap.trim() !== user?.namaPengguna ||
      email.trim().toLowerCase() !== user?.email.toLowerCase() ||
      password !== 'password123');

  const handleSaveProfile = async () => {
    setFeedbackBanner(null);
    if (!isFormValid) {
      return;
    }

    const result = await updateUserProfile({
      namaPengguna: namaLengkap,
      email,
      password,
    });

    setFeedbackBanner({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
  };

  /**
   * UI-14-04: Ikon kamera untuk mengganti foto profil / avatar
   */
  const handleChangeAvatar = () => {
    const nextIdx = (avatarBgIndex + 1) % AVATAR_COLOR_PALETTE.length;
    setAvatarBgIndex(nextIdx);
    Alert.alert(
      'Foto Profil',
      'Pratinjau warna avatar profil berhasil diperbarui.'
    );
  };

  /**
   * UI-14-09: Konfirmasi Keluar Akun -> membersihkan state sesi & kembali ke UI-01
   */
  const confirmLogout = () => {
    setIsLogoutModalVisible(false);
    const target = logoutSession();
    onLogoutSuccess(target);
  };

  const initials = getInitials(namaLengkap);

  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topContent}>
          {/* UI-14-01 & UI-14-02: Tombol "‹ Kembali" dan Judul "Profil Saya" */}
          <Header variant="back" title="Profil Saya" onBackPress={onBack} />

          {/* UI-14-03 & UI-14-04: Avatar Inisial dan Tombol Kamera */}
          <View style={styles.avatarSection}>
            <View
              style={[
                styles.avatarBox,
                { backgroundColor: AVATAR_COLOR_PALETTE[avatarBgIndex] },
              ]}
            >
              <Text style={styles.avatarInitials}>{initials}</Text>

              <TouchableOpacity
                testID="profile-camera-button"
                style={styles.cameraBadgeButton}
                onPress={handleChangeAvatar}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Ganti foto profil"
              >
                <View style={styles.cameraIconOutline}>
                  <View style={styles.cameraLensDot} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {feedbackBanner ? (
            <View
              style={[
                styles.feedbackBanner,
                feedbackBanner.type === 'success'
                  ? styles.feedbackSuccess
                  : styles.feedbackError,
              ]}
            >
              <Text
                style={[
                  styles.feedbackText,
                  feedbackBanner.type === 'success'
                    ? styles.feedbackSuccessText
                    : styles.feedbackErrorText,
                ]}
              >
                {feedbackBanner.text}
              </Text>
            </View>
          ) : null}

          {/* UI-14-05: Field Nama Lengkap */}
          <InputField
            testID="profile-name-input"
            label="Nama Lengkap"
            value={namaLengkap}
            onChangeText={(text) => {
              setFeedbackBanner(null);
              setNamaLengkap(text);
            }}
            placeholder="Masukkan nama lengkap"
            leftIcon="person"
            autoCapitalize="words"
            errorMessage={nameValidation.errorMessage}
          />

          {/* UI-14-06: Field Email */}
          <InputField
            testID="profile-email-input"
            label="Email"
            value={email}
            onChangeText={(text) => {
              setFeedbackBanner(null);
              setEmail(text);
            }}
            placeholder="Masukkan email"
            leftIcon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={emailValidation.errorMessage}
          />

          {/* UI-14-07 & UI-14-08: Field Password + Ikon Mata Show/Hide */}
          <InputField
            testID="profile-password-input"
            label="Password"
            value={password}
            onChangeText={(text) => {
              setFeedbackBanner(null);
              setPassword(text);
            }}
            placeholder="Minimal 8 karakter"
            leftIcon="lock"
            isPassword
            errorMessage={passwordValidation.errorMessage}
          />

          {hasChanges && (
            <Button
              testID="profile-save-button"
              title="Simpan Perubahan"
              onPress={handleSaveProfile}
              disabled={!isFormValid}
              loading={isLoading}
              style={styles.saveProfileBtn}
            />
          )}
        </View>

        {/* UI-14-09: Button "Keluar Akun" */}
        <View style={styles.bottomSection}>
          <Button
            testID="profile-logout-button"
            title="Keluar Akun"
            variant="dangerOutline"
            showLogoutIcon
            onPress={() => setIsLogoutModalVisible(true)}
          />
        </View>
      </ScrollView>

      {/* Modal Konfirmasi Keluar Akun (UI-14-09) */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLogoutModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard} testID="logout-confirmation-modal">
            <Text style={styles.modalTitle}>Keluar dari Akun?</Text>
            <Text style={styles.modalMessage}>
              Sesi kamu akan diakhiri dan kamu perlu masuk kembali untuk
              mengakses akun CariUang.
            </Text>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                testID="logout-cancel-button"
                style={styles.modalCancelBtn}
                onPress={() => setIsLogoutModalVisible(false)}
                activeOpacity={0.75}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="logout-confirm-button"
                style={styles.modalConfirmBtn}
                onPress={confirmLogout}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Keluar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F8',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 38,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  topContent: {
    width: '100%',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  avatarBox: {
    width: 112,
    height: 112,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarInitials: {
    fontSize: 38,
    fontWeight: '800',
    color: '#13334C',
    letterSpacing: 1,
  },
  cameraBadgeButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#13334C',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconOutline: {
    width: 15,
    height: 12,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLensDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 1.2,
    borderColor: '#FFFFFF',
  },
  feedbackBanner: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  feedbackError: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
  },
  feedbackSuccessText: {
    color: '#166534',
  },
  feedbackErrorText: {
    color: '#991B1B',
  },
  saveProfileBtn: {
    marginTop: 8,
  },
  bottomSection: {
    marginTop: 40,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(19, 51, 76, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#13334C',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 22,
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  modalConfirmBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#C24136',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ProfileView;
