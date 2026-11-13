import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { KeyboardAwareView } from '../../components/common/KeyboardAwareView';
import Header from '../../components/Header';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useAuthController } from '../../controllers/useAuthController';
import { ScreenName } from '../../navigation/types';

export interface LoginViewProps {
  onNavigate: (screen: ScreenName) => void;
}

/**
 * UI-01: Layar Login
 * Realisasi Kelas DPPL: C05 PemberiJasaUI, C08 PelangganUI, C11 LayananPelangganUI
 * Use Case: UC11 (Skenario Normal & Skenario Alternatif 1)
 */
export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const {
    isLoading,
    authError,
    clearAuthError,
    validateEmailInstant,
    validatePasswordInstant,
    triggerQueryLogin,
  } = useAuthController();

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [identifierTouched, setIdentifierTouched] = useState<boolean>(false);
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);

  // Feedback instan saat mengetik (Acceptance Criteria)
  const identifierValidation = identifierTouched
    ? validateEmailInstant(identifier, true)
    : { isValid: true };

  const passwordValidation = passwordTouched
    ? validatePasswordInstant(password)
    : { isValid: true };

  const handleIdentifierChange = (text: string) => {
    if (!identifierTouched) setIdentifierTouched(true);
    if (authError) clearAuthError();
    setIdentifier(text);
  };

  const handlePasswordChange = (text: string) => {
    if (!passwordTouched) setPasswordTouched(true);
    if (authError) clearAuthError();
    setPassword(text);
  };

  /**
   * Operasi pressLogin() -> memicu triggerQueryLogin() dan pindahHalaman() sesuai role
   */
  const pressLogin = async () => {
    setIdentifierTouched(true);
    setPasswordTouched(true);

    const idCheck = validateEmailInstant(identifier, true);
    const passCheck = validatePasswordInstant(password);
    if (!idCheck.isValid || !passCheck.isValid) {
      return;
    }

    const result = await triggerQueryLogin(identifier, password);
    if (result.success && result.targetScreen) {
      onNavigate(result.targetScreen);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Pemulihan Password',
      'Silakan masukkan email terdaftar Anda atau hubungi Layanan Pelanggan CariUang untuk mengatur ulang password.'
    );
  };

  return (
    <KeyboardAwareView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          {/* UI-01-01 & UI-01-02: Logo, Tagline, Judul "Selamat datang" & Subjudul */}
          <Header
            variant="brand"
            title="Selamat datang"
            subtitle="Masuk untuk lanjut cari peluangmu."
            showWelcomeAvatar
          />

          {/* Skenario Alternatif 1 UC11: Penanganan pesan error kredensial tidak valid */}
          {authError ? (
            <View style={styles.errorBanner} testID="login-error-banner">
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          ) : null}

          {/* UI-01-03: Input Email / Username */}
          <InputField
            testID="login-email-input"
            label="Email"
            value={identifier}
            onChangeText={handleIdentifierChange}
            placeholder="Masukkan email kamu"
            leftIcon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={identifierValidation.errorMessage}
          />

          {/* UI-01-04 & UI-01-05: Input Password dengan ikon mata show/hide */}
          <InputField
            testID="login-password-input"
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="Masukkan password kamu"
            leftIcon="lock"
            isPassword
            errorMessage={passwordValidation.errorMessage}
          />

          {/* UI-01-06: Link "Lupa password?" */}
          <TouchableOpacity
            style={styles.forgotPasswordWrap}
            onPress={handleForgotPassword}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>Lupa password?</Text>
          </TouchableOpacity>

          {/* UI-01-07: Button "Lanjut →" */}
          <Button
            testID="login-submit-button"
            title="Lanjut"
            showArrow
            onPress={pressLogin}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.bottomSection}>
          {/* UI-01-08: Link "Daftar sekarang" menuju UI-02 */}
          <View style={styles.registerPromptWrap}>
            <Text style={styles.registerPromptLabel}>Belum punya akun?</Text>
            <TouchableOpacity
              testID="login-to-register-link"
              onPress={() => {
                clearAuthError();
                onNavigate('RegisterCustomer');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLinkText}>Daftar sekarang</Text>
            </TouchableOpacity>
          </View>

          {/* UI-01-09: Label Ketentuan Layanan & Kebijakan Privasi */}
          <Text style={styles.termsFooterText}>
            Dengan melanjutkan, kamu menyetujui Ketentuan{'\n'}Layanan dan
            Kebijakan Privasi CariUang.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAwareView>
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
    paddingTop: 48,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
  },
  forgotPasswordWrap: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#0F8A75',
    fontSize: 14,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: 4,
  },
  bottomSection: {
    alignItems: 'center',
    marginTop: 36,
  },
  registerPromptWrap: {
    alignItems: 'center',
    marginBottom: 40,
  },
  registerPromptLabel: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 6,
  },
  registerLinkText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F8A75',
  },
  termsFooterText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginView;
