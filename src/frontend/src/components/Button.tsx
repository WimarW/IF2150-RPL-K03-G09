import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'dangerOutline' | 'secondaryOutline';
  showArrow?: boolean;
  showLogoutIcon?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  showArrow = false,
  showLogoutIcon = false,
  disabled = false,
  loading = false,
  style,
  testID,
}) => {
  const isInactive = disabled || loading;

  if (variant === 'dangerOutline') {
    return (
      <TouchableOpacity
        testID={testID}
        style={[
          styles.dangerOutlineBtn,
          isInactive && styles.disabledBtn,
          style,
        ]}
        onPress={onPress}
        disabled={isInactive}
        activeOpacity={0.75}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator color="#B9382C" />
        ) : (
          <View style={styles.dangerInnerRow}>
            {showLogoutIcon && (
              <View style={styles.logoutIconBox}>
                <Text style={styles.logoutIconSymbol}>⇥</Text>
              </View>
            )}
            <Text style={styles.dangerOutlineText}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'secondaryOutline') {
    return (
      <TouchableOpacity
        testID={testID}
        style={[
          styles.secondaryOutlineBtn,
          isInactive && styles.disabledBtn,
          style,
        ]}
        onPress={onPress}
        disabled={isInactive}
        activeOpacity={0.75}
        accessibilityRole="button"
      >
        <Text style={styles.secondaryOutlineText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.primaryBtn,
        isInactive && styles.primaryBtnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.85}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <View style={styles.primaryInnerRow}>
          <Text style={styles.primaryBtnText}>{title}</Text>
          {showArrow && <Text style={styles.arrowSymbol}>→</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: '#0F8A75',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#0F8A75',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnDisabled: {
    backgroundColor: '#94C9BF',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  arrowSymbol: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 14,
  },
  dangerOutlineBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#C24136',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 20,
    minHeight: 56,
    justifyContent: 'center',
  },
  dangerInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoutIconBox: {
    position: 'absolute',
    left: 2,
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.8,
    borderColor: '#B9382C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIconSymbol: {
    color: '#B9382C',
    fontSize: 13,
    fontWeight: '800',
  },
  dangerOutlineText: {
    color: '#B9382C',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryOutlineBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryOutlineText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  disabledBtn: {
    opacity: 0.55,
  },
});

export default Button;
