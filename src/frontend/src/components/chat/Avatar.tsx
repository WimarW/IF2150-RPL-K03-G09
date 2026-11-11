import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { getInitials } from '../../utils/chatUtils';

interface AvatarProps {
  name: string;
  isCS?: boolean;
  isOnline?: boolean;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = React.memo(({
  name,
  isCS = false,
  isOnline = false,
  size = 44,
}) => {
  const initials = getInitials(name);
  const borderRadius = Math.round(size * 0.32);
  const fontSize = Math.round(size * 0.36);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: isCS ? colors.slate100 : colors.mint,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      {isOnline && <View style={styles.onlineDot} />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  initials: {
    fontWeight: '700',
    color: colors.navy,
  },
  onlineDot: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
});
