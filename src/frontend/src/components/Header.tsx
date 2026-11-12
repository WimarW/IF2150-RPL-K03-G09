import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const UI_THEME = {
  background: '#F4F8F7',
  surface: '#FFFFFF',
  primary: '#1E8E7E',
  textTitle: '#1C2E36',
  textBody: '#2D414A',
  textMuted: '#687E87',
  border: '#D6E2E0',
  error: '#E04F5F',
  errorBg: '#FDECEE',
} as const;

export interface HeaderProps {
  variant?: 'brand' | 'back';
  title?: string;
  subtitle?: string;
  onBackPress?: () => void;
  backLabel?: string;
  showWelcomeAvatar?: boolean;
  testID?: string;
}

/**
 * Komponen Header global aplikasi CariUang.
 * - variant="brand": Menampilkan logo CariUang + tagline "CARI PELUANG, DAPAT UANG." beserta judul & subjudul layar (UI-01, UI-02, UI-03).
 * - variant="back" (default): Menampilkan tombol "‹ Kembali" beserta judul & subjudul layar (UI-14, UI-15, UI-16, dll.).
 */
export const Header: React.FC<HeaderProps> = ({
  variant = 'back',
  title,
  subtitle,
  onBackPress,
  backLabel = 'Kembali',
  showWelcomeAvatar = false,
  testID,
}) => {
  if (variant === 'brand') {
    return (
      <View style={styles.brandContainer} testID={testID}>
        {/* Brand Logo & Tagline */}
        <View style={styles.brandRow}>
          <View style={styles.logoIconBox}>
            <View style={styles.coinOuter}>
              <Text style={styles.coinSymbol}>$</Text>
            </View>
            <View style={styles.magnifierHandle} />
          </View>
          <View style={styles.brandTextWrap}>
            <Text style={styles.brandTitle}>
              Cari<Text style={styles.brandTitleAccent}>Uang</Text>
            </Text>
            <Text style={styles.brandTagline}>CARI PELUANG, DAPAT UANG.</Text>
          </View>
        </View>

        {/* Page Title & Subtitle */}
        {(title || subtitle) && (
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeTextCol}>
              {title ? <Text style={styles.pageTitle}>{title}</Text> : null}
              {subtitle ? (
                <Text style={styles.pageSubtitle}>{subtitle}</Text>
              ) : null}
            </View>

            {showWelcomeAvatar && (
              <View style={styles.welcomeIllustration}>
                <View style={styles.avatarHead} />
                <View style={styles.avatarShoulders} />
              </View>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container} testID={testID}>
      {onBackPress ? (
        <Pressable
          onPress={onBackPress}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          testID={testID ? `${testID}-back-button` : 'header-back-button'}
        >
          <Ionicons name="chevron-back" size={20} color={UI_THEME.textTitle} />
          <Text style={styles.backLabel}>{backLabel}</Text>
        </Pressable>
      ) : null}

      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  // Variant: back (default)
  container: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 14,
    marginLeft: -4,
  },
  backButtonPressed: {
    opacity: 0.65,
  },
  backLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: UI_THEME.textTitle,
    marginLeft: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: UI_THEME.textTitle,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: UI_THEME.textMuted,
    lineHeight: 20,
  },

  // Variant: brand
  brandContainer: {
    width: '100%',
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  logoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E1F5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    position: 'relative',
  },
  coinOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#13334C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinSymbol: {
    fontSize: 13,
    fontWeight: '800',
    color: '#13334C',
  },
  magnifierHandle: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 9,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#14967F',
    transform: [{ rotate: '40deg' }],
  },
  brandTextWrap: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#13334C',
    letterSpacing: -0.4,
    lineHeight: 30,
  },
  brandTitleAccent: {
    color: '#14967F',
  },
  brandTagline: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.6,
    marginTop: 1,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomeTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#13334C',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14.5,
    color: '#64748B',
    lineHeight: 20,
  },
  welcomeIllustration: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DDF3EE',
    borderWidth: 2,
    borderColor: '#B8E5DA',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  avatarHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#13334C',
    marginBottom: 4,
  },
  avatarShoulders: {
    width: 44,
    height: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: '#14967F',
  },
});

export default Header;
