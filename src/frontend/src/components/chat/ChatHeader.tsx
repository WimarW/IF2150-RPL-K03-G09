import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { colors } from '../../theme/colors';

interface ChatHeaderProps {
  partnerName: string;
  isOnline?: boolean;
  isCS?: boolean;
  variant?: 'customer' | 'provider';
  onBack: () => void;
  onMorePress?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = React.memo(({
  partnerName,
  isOnline = false,
  isCS = false,
  variant = 'customer',
  onBack,
  onMorePress,
}) => {
  return (
    <View style={styles.header}>
      {variant === 'provider' ? (
        <View style={styles.providerTop}>
          <TouchableOpacity
            style={styles.backButtonText}
            onPress={onBack}
            accessibilityLabel="Kembali"
          >
            <Feather name="chevron-left" size={20} color={colors.navy} />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.mainRow}>
        {variant === 'customer' && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBack}
            accessibilityLabel="Kembali"
          >
            <Feather name="chevron-left" size={24} color={colors.navy} />
          </TouchableOpacity>
        )}

        <Avatar name={partnerName} isCS={isCS} isOnline={isOnline} size={38} />

        <View style={styles.titleArea}>
          <Text style={styles.name} numberOfLines={1}>
            {partnerName}
          </Text>
          <View style={styles.statusRow}>
            {isOnline && <View style={styles.statusDot} />}
            <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>

        {onMorePress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMorePress}
            accessibilityLabel="Menu pilihan"
          >
            <Ionicons name="ellipsis-vertical" size={20} color={colors.navy} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  providerTop: {
    marginBottom: 6,
  },
  backButtonText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
    marginLeft: 2,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginRight: 4,
  },
  titleArea: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.navy,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});