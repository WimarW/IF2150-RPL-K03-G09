import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ChatMessage } from '../../types/chat';
import { colors } from '../../theme/colors';

interface ChatBubbleProps {
  message: ChatMessage;
  isOutgoing: boolean;
  onRetry?: (clientId: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = React.memo(({
  message,
  isOutgoing,
  onRetry,
}) => {
  const { isiPesan, waktuTerkirim, statusChat, clientId } = message;
  const formattedTime = new Date(waktuTerkirim).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const isFailed = statusChat === 'FAILED';
  const isSending = statusChat === 'SENDING';

  return (
    <View style={[styles.container, isOutgoing ? styles.outgoingContainer : styles.incomingContainer]}>
      <View
        style={[
          styles.bubble,
          isOutgoing ? styles.outgoingBubble : styles.incomingBubble,
          isFailed && styles.failedBubble,
        ]}
      >
        <Text style={[styles.text, isOutgoing ? styles.outgoingText : styles.incomingText]}>
          {isiPesan}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.time}>{formattedTime}</Text>
        {isOutgoing && isSending && (
          <Feather name="clock" size={12} color={colors.textSecondary} style={styles.statusIcon} />
        )}
      </View>

      {isOutgoing && isFailed && (
        <View style={styles.failedRow}>
          <Text style={styles.failedText}>Pesan tidak terkirim</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => onRetry && onRetry(clientId)}
            accessibilityLabel="Kirim ulang pesan"
          >
            <Feather name="refresh-cw" size={13} color={colors.danger} />
            <Text style={styles.retryText}>Kirim ulang</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  incomingContainer: {
    alignSelf: 'flex-start',
  },
  outgoingContainer: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  incomingBubble: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
  },
  outgoingBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  failedBubble: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
    opacity: 0.9,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  incomingText: {
    color: colors.navy,
  },
  outgoingText: {
    color: colors.white,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginHorizontal: 4,
    alignSelf: 'flex-end',
  },
  time: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statusIcon: {
    marginLeft: 4,
  },
  failedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  failedText: {
    fontSize: 11,
    color: colors.danger,
    marginRight: 6,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryText: {
    fontSize: 11,
    color: colors.danger,
    fontWeight: '700',
    marginLeft: 2,
  },
});