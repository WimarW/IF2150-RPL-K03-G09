import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export interface HeaderProps {
  variant?: 'brand' | 'back';
  title?: string;
  subtitle?: string;
  onBackPress?: () => void;
  showWelcomeAvatar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  variant = 'brand',
  title,
  subtitle,
  onBackPress,
  showWelcomeAvatar = false,
}) => {
  if (variant === 'back') {
    return (
      <View style={styles.backHeaderContainer}>
        {onBackPress && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Kembali"
          >
            <Text style={styles.backChevron}>‹</Text>
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>
        )}
        {title ? <Text style={styles.screenTitle}>{title}</Text> : null}
        {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
      </View>
    );
  }

  return (
    <View style={styles.brandWrapper}>
      {/* UI-01-01 / UI-02-01 / UI-03-01: Logo CariUang & Tagline */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <View style={styles.logoLens}>
            <Text style={styles.logoSparkle}>✦</Text>
          </View>
          <View style={styles.logoHandle} />
        </View>
        <View>
          <Text style={styles.brandNamePrimary}>
            Cari<Text style={styles.brandNameAccent}>Uang</Text>
          </Text>
          <Text style={styles.brandTagline}>PLATFORM JASA & KERJA INFORMAL</Text>
        </View>
      </View>

      {showWelcomeAvatar && (
        <View style={styles.welcomeAvatarRow}>
          <View style={styles.welcomeAvatarCircle}>
            <View style={styles.avatarHead} />
            <View style={styles.avatarBody} />
          </View>
        </View>
      )}

      {title ? <Text style={styles.authTitle}>{title}</Text> : null}
      {subtitle ? <Text style={styles.authSubtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  brandWrapper: {
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#13334C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  logoLens: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSparkle: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '700',
  },
  logoHandle: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 12,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#13334C',
    transform: [{ rotate: '40deg' }],
  },
  brandNamePrimary: {
    fontSize: 24,
    fontWeight: '800',
    color: '#13334C',
    letterSpacing: 0.2,
  },
  brandNameAccent: {
    color: '#14967F',
  },
  brandTagline: {
    fontSize: 9,
    fontWeight: '800',
    color: '#13334C',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  welcomeAvatarRow: {
    alignItems: 'flex-end',
    marginTop: -12,
    marginBottom: -8,
  },
  welcomeAvatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#D8F1EC',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingBottom: 6,
  },
  avatarHead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F2B880',
    borderTopWidth: 7,
    borderTopColor: '#13334C',
    marginBottom: 3,
  },
  avatarBody: {
    width: 42,
    height: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#14967F',
  },
  authTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#13334C',
    marginBottom: 6,
  },
  authSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 21,
  },
  backHeaderContainer: {
    marginBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 8,
  },
  backChevron: {
    fontSize: 28,
    lineHeight: 28,
    color: '#13334C',
    fontWeight: '600',
    marginRight: 6,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#13334C',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#13334C',
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
});

export default Header;
