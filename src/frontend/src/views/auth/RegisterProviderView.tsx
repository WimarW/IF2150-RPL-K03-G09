import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useAuthController } from '../../controllers/useAuthController';
import {
  ScreenName,
  PendingProviderRegistration,
} from '../../navigation/types';

export interface RegisterProviderViewProps {
  onNavigate: (
    screen: ScreenName,
    params?: { pendingProvider?: PendingProviderRegistration }
  ) => void;
}

/**
 * UI-03: Buat Akun Jasa (Penyedia Jasa)
 * Realisasi Kelas DPPL: C02 PenggunaUI, C05 PemberiJasaUI
 * Use Case: UC12 (Skenario Pemberi Jasa) & navigasi ke alur verifikasi/pendaftaran jasa (UI-16)
 */
export const RegisterProviderView: React.FC<RegisterProviderViewProps> = ({
  onNavigate,
}) => {
  const {
    isLoading,
    authError,
    clearAuthError,
    validateRequiredName,
    validateEmailInstant,
    validatePasswordInstant,
    validateConfirmPasswordInstant,
    validasiInfoRegistrasi,
  } = useAuthController();

  const [namaLengkap, setNamaLengkap] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  const [touched, setTouched] = useState<{
    nama: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  }>({
    nama: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Validasi instan per field (Acceptance Criteria)
  const nameValidation = touched.nama
    ? validateRequiredName(namaLengkap)
    : { isValid: true };
  const emailValidation = touched.email
    ? validateEmailInstant(email, false)
    : { isValid: true };
  const passwordValidation = touched.password
    ? validatePasswordInstant(password)
    : { isValid: true };
  const confirmValidation = touched.confirmPassword
    ? validateConfirmPasswordInstant(password, confirmPassword)
    : { isValid: true };

  const formCheck = validasiInfoRegistrasi({
    namaPengguna: namaLengkap,
    email,
    password,
    confirmPassword,
    agreedToTerms,
  });

  /**
   * UI-03-08: Tombol "Buat Akun →"
   * Memvalidasi data akun penyedia jasa lalu mengarahkan ke alur verifikasi/kelengkapan jasa (UI-16 ServiceRegistrationView)
   */
  const pressRegisterProvider = () => {
    setTouched({
      nama: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!formCheck.valid) {
      return;
    }

    onNavigate('ServiceRegistration', {
      pendingProvider: {
        namaPengguna: namaLengkap.trim(),
        email: email.trim().toLowerCase(),
        password,
      },
    });
  };

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
        {/* UI-03-01 & UI-03-02: Logo CariUang, Judul "Buat akun jasa" & Subjudul */}
        <Header
          variant="brand"
          title="Buat akun jasa"
          subtitle="Mulai temukan jasa dan peluang kerja."
        />

        {authError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{authError}</Text>
          </View>
        ) : null}

        {/* UI-03-03: Field Nama Lengkap */}
        <InputField
          testID="register-provider-name-input"
          label="Nama lengkap"
          value={namaLengkap}
          onChangeText={(text) => {
            if (!touched.nama) setTouched((prev) => ({ ...prev, nama: true }));
            if (authError) clearAuthError();
            setNamaLengkap(text);
          }}
          placeholder="Masukkan nama lengkap"
          leftIcon="person"
          autoCapitalize="words"
          errorMessage={nameValidation.errorMessage}
        />

        {/* UI-03-04: Field Email */}
        <InputField
          testID="register-provider-email-input"
          label="Email"
          value={email}
          onChangeText={(text) => {
            if (!touched.email) setTouched((prev) => ({ ...prev, email: true }));
            if (authError) clearAuthError();
            setEmail(text);
          }}
          placeholder="Masukkan email aktif"
          leftIcon="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessage={emailValidation.errorMessage}
        />

        {/* UI-03-05 & UI-03-07: Field Password (min. 8 karakter) + ikon mata */}
        <InputField
          testID="register-provider-password-input"
          label="Password"
          value={password}
          onChangeText={(text) => {
            if (!touched.password)
              setTouched((prev) => ({ ...prev, password: true }));
            if (authError) clearAuthError();
            setPassword(text);
          }}
          placeholder="Buat password (min. 8 karakter)"
          leftIcon="lock"
          isPassword
          errorMessage={passwordValidation.errorMessage}
        />

        {/* UI-03-06 & UI-03-07: Field Konfirmasi Password + ikon mata */}
        <InputField
          testID="register-provider-confirm-input"
          label="Konfirmasi password"
          value={confirmPassword}
          onChangeText={(text) => {
            if (!touched.confirmPassword)
              setTouched((prev) => ({ ...prev, confirmPassword: true }));
            if (authError) clearAuthError();
            setConfirmPassword(text);
          }}
          placeholder="Ulangi password kamu"
          leftIcon="lock"
          isPassword
          errorMessage={confirmValidation.errorMessage}
        />

        {/* UI-03-08: Button "Buat Akun →" */}
        <Button
          testID="register-provider-submit-button"
          title="Buat Akun"
          showArrow
          onPress={pressRegisterProvider}
          disabled={!formCheck.valid}
          loading={isLoading}
          style={styles.submitButton}
        />

        {/* UI-03-09: Checkbox "Saya setuju dengan Ketentuan Layanan" */}
        <TouchableOpacity
          testID="register-provider-terms-checkbox"
          style={styles.checkboxRow}
          onPress={() => setAgreedToTerms((prev) => !prev)}
          activeOpacity={0.75}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreedToTerms }}
        >
          <View
            style={[
              styles.checkboxBox,
              agreedToTerms && styles.checkboxBoxChecked,
            ]}
          >
            {agreedToTerms && <Text style={styles.checkboxTick}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            Saya setuju dengan Ketentuan Layanan
          </Text>
        </TouchableOpacity>

        {/* UI-03-10 & UI-03-11: Link "Masuk" & Informasi Tambahan */}
        <View style={styles.bottomLinksContainer}>
          <Text style={styles.promptText}>Sudah punya akun?</Text>
          <TouchableOpacity
            onPress={() => {
              clearAuthError();
              onNavigate('Login');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.linkText}>Masuk</Text>
          </TouchableOpacity>

          <Text style={styles.footerInfoText}>
            Akunmu membantu mengelola pesanan,{'\n'}lamaran, dan percakapan di
            CariUang.
          </Text>
        </View>
      </ScrollView>
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
    paddingTop: 42,
    paddingBottom: 28,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: '#14967F',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxBoxChecked: {
    backgroundColor: '#0F8A75',
    borderColor: '#0F8A75',
  },
  checkboxTick: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  checkboxLabel: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomLinksContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  promptText: {
    fontSize: 14.5,
    color: '#64748B',
    marginBottom: 4,
  },
  linkText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F8A75',
  },
  footerInfoText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 44,
  },
});

export default RegisterProviderView;
