import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { ConversationSummary } from '../../types/chat';
import { Avatar } from './Avatar';
import { UnreadBadge } from './UnreadBadge';
import { CSTag } from './CSTag';
import { colors } from '../../theme/colors';
import { formatTimeShort } from '../../utils/chatUtils';

interface ConversationCardProps {
  conversation: ConversationSummary;
  onPress: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = React.memo(({
  conversation,
  onPress,
}) => {
  const { partnerName, isCS, isOnline, lastMessage, lastMessageAt, unreadCount } = conversation;
  const hasUnread = unreadCount > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Obrolan dengan ${partnerName}`}
    >
      <Avatar name={partnerName} isCS={isCS} isOnline={isOnline} size={50} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {partnerName}
            </Text>
            {isCS && <CSTag />}
          </View>
          <Text style={styles.time}>{formatTimeShort(lastMessageAt)}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text
            style={[styles.lastMessage, hasUnread && styles.unreadText]}
            numberOfLines={1}
          >
            {lastMessage}
          </Text>
          <UnreadBadge count={unreadCount} />
        </View>
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
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
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 8,
  },
  unreadText: {
    fontWeight: '700',
    color: colors.navy,
  },
});