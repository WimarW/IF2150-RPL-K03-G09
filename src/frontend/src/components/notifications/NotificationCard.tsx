import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AppNotification } from '../../types/chat';
import { colors } from '../../theme/colors';
import { formatRelativeNotificationTime } from '../../utils/chatUtils';

interface NotificationCardProps {
  notification: AppNotification;
  onPress: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = React.memo(({
  notification,
  onPress,
}) => {
  const { tipe, isiNotifikasi, waktuNotifikasi, statusBaca } = notification;

  let iconName: keyof typeof Feather.glyphMap = 'bell';
  let tileBg = colors.slate100;
  let dotColor = colors.primary;
  let title = 'Notifikasi';

  switch (tipe) {
    case 'PESANAN_BARU':
      iconName = 'calendar';
      tileBg = colors.warningBg;
      dotColor = colors.warning;
      title = 'Pesanan Baru';
      break;
    case 'PESAN_BARU':
      iconName = 'message-square';
      tileBg = colors.mint;
      dotColor = colors.primary;
      title = 'Pesan Baru';
      break;
    case 'INFO_TIKET':
      iconName = 'help-circle';
      tileBg = colors.slate100;
      dotColor = colors.primary;
      title = 'Info Tiket';
      break;
    case 'PROMO':
      iconName = 'flag';
      tileBg = colors.slate100;
      dotColor = colors.primary;
      title = 'Promo Spesial';
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Notifikasi ${title}`}
    >
      <View style={[styles.tileIcon, { backgroundColor: tileBg }]}>
        <Feather name={iconName} size={20} color={colors.navy} />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{title}</Text>
          {!statusBaca && <View style={[styles.unreadDot, { backgroundColor: dotColor }]} />}
        </View>

        <Text style={styles.body} numberOfLines={2}>
          {isiNotifikasi}
        </Text>

        <Text style={styles.time}>{formatRelativeNotificationTime(waktuNotifikasi)}</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  body: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.warning,
  },
});