import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { UI_THEME } from './Header';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'dangerOutline'
  | 'secondaryOutline';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  showArrow?: boolean;
  showLogoutIcon?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Komponen Button global CariUang
 * Mendukung varian primary, secondary, dangerOutline (Keluar Akun UI-14-09), dan secondaryOutline.
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  showArrow = false,
  showLogoutIcon = false,
  style,
  testID,
}) => {
  const isInteractive = !disabled && !loading;
  const isPrimary = variant === 'primary';
  const isDangerOutline = variant === 'dangerOutline';
  const isSecondaryOutline =
    variant === 'secondary' || variant === 'secondaryOutline';

  const spinnerColor = isPrimary
    ? '#FFFFFF'
    : isDangerOutline
    ? '#C24136'
    : UI_THEME.primary;

  return (
    <Pressable
      onPress={isInteractive ? onPress : undefined}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        isSecondaryOutline && styles.secondary,
        isDangerOutline && styles.dangerOutline,
        !isInteractive && isPrimary && styles.disabledPrimary,
        !isInteractive && !isPrimary && styles.disabledOutline,
        isInteractive && pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {showLogoutIcon && (
            <View style={styles.logoutIconBox}>
              <Text style={styles.logoutIconSymbol}>↪</Text>
            </View>
          )}
          <Text
            style={[
              styles.labelBase,
              isPrimary && styles.primaryLabel,
              isSecondaryOutline && styles.secondaryLabel,
              isDangerOutline && styles.dangerOutlineLabel,
            ]}
          >
            {title}
          </Text>
          {showArrow && (
            <Text
              style={[
                styles.arrowSymbol,
                isPrimary && styles.primaryLabel,
                isSecondaryOutline && styles.secondaryLabel,
              ]}
            >
              →
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 54,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: UI_THEME.primary,
    shadowColor: '#0F8A75',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  secondary: {
    backgroundColor: UI_THEME.surface,
    borderWidth: 1.5,
    borderColor: UI_THEME.primary,
  },
  dangerOutline: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1.5,
    borderColor: '#C24136',
  },
  disabledPrimary: {
    backgroundColor: '#98CBC3',
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledOutline: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.88,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelBase: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryLabel: {
    color: '#FFFFFF',
  },
  secondaryLabel: {
    color: UI_THEME.primary,
  },
  dangerOutlineLabel: {
    color: '#C24136',
  },
  arrowSymbol: {
    fontSize: 19,
    fontWeight: '700',
    marginLeft: 10,
  },
  logoutIconBox: {
    marginRight: 8,
  },
  logoutIconSymbol: {
    fontSize: 17,
    fontWeight: '800',
    color: '#C24136',
  },
});

export default Button;
