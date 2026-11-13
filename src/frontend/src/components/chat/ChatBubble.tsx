import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ChatMessage } from '../../types/chat';
import { colors } from '../../theme/colors';
import { resolveFileUrl } from '../../services/api';

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
  const { isiPesan, waktuTerkirim, statusChat, clientId, lampiranUrl } = message;
  const imageUri = resolveFileUrl(lampiranUrl);
  const [isImageOpen, setIsImageOpen] = useState(false);
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
          imageUri ? styles.imageBubble : null,
        ]}
      >
        {imageUri && (
          <TouchableOpacity
            onPress={() => setIsImageOpen(true)}
            activeOpacity={0.85}
            accessibilityLabel="Lihat foto lampiran"
          >
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        )}
        {isiPesan.length > 0 && (
          <Text
            style={[
              styles.text,
              isOutgoing ? styles.outgoingText : styles.incomingText,
              imageUri ? styles.captionText : null,
            ]}
          >
            {isiPesan}
          </Text>
        )}
      </View>

      {imageUri && (
        <Modal
          visible={isImageOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsImageOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setIsImageOpen(false)}
              accessibilityLabel="Tutup foto"
            >
              <Feather name="x" size={28} color={colors.white} />
            </TouchableOpacity>
            <Image source={{ uri: imageUri }} style={styles.fullImage} resizeMode="contain" />
          </View>
        </Modal>
      )}

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
  imageBubble: {
    padding: 4,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 14,
    backgroundColor: colors.bg,
  },
  captionText: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 1,
    padding: 6,
  },
  fullImage: {
    width: '100%',
    height: '80%',
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