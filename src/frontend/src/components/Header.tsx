import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const UI_THEME = {
  background: '#F5F7F6',
  surface: '#FFFFFF',
  primary: '#20AE96',
  textTitle: '#1B3A5C',
  textBody: '#1F2933',
  textMuted: '#7A8794',
  border: '#E3E8EC',
  error: '#D93025',
  errorBg: '#FDECEA',
} as const;

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  backLabel?: string;
  testID?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  backLabel = 'Kembali',
  testID,
}) => {
  return (
    <View style={styles.container} testID={testID}>
      {onBackPress ? (
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={onBackPress}
          accessibilityRole="button"
          accessibilityLabel={`${backLabel}, kembali ke layar sebelumnya`}
          testID={testID ? `${testID}-back` : 'ui16-back-button'}
        >
          <Ionicons name="chevron-back" size={20} color={UI_THEME.textTitle} />
          <Text style={styles.backText}>{backLabel}</Text>
        </Pressable>
      ) : null}

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginBottom: 16,
  },
  backButtonPressed: {
    opacity: 0.7,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: UI_THEME.textTitle,
    marginLeft: 4,
  },
  titleContainer: {
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: UI_THEME.textTitle,
  },
  subtitle: {
    fontSize: 14,
    color: UI_THEME.textMuted,
    lineHeight: 20,
  },
});

export default Header;
