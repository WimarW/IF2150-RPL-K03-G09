import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Text, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';
import { ChatAttachment } from '../../types/chat';
import { CHAT_CONFIG } from '../../config/chatConfig';

interface MessageInputProps {
  onSend: (text: string, attachment?: ChatAttachment | null) => void;
  /** Dipanggil saat tombol lampiran ditekan namun fitur lampiran dinonaktifkan */
  onPressAttach?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = React.memo(({
  onSend,
  onPressAttach,
}) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);

  const pickAttachment = async () => {
    if (!CHAT_CONFIG.ATTACHMENT_ENABLED) {
      onPressAttach?.();
      return;
    }

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Izin diperlukan', 'Izinkan akses galeri untuk melampirkan foto.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (res.canceled || !res.assets?.length) return;

    const asset = res.assets[0];
    const mime = asset.mimeType ?? 'image/jpeg';
    if (mime !== 'image/jpeg' && mime !== 'image/png') {
      Alert.alert('Format tidak sesuai', 'Foto harus berformat JPG atau PNG.');
      return;
    }
    if (asset.fileSize && asset.fileSize > CHAT_CONFIG.MAX_ATTACHMENT_BYTES) {
      Alert.alert('Ukuran terlalu besar', 'Ukuran foto maksimal 5MB.');
      return;
    }

    setAttachment({ uri: asset.uri, mimeType: mime });
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed && !attachment) return;
    onSend(trimmed, attachment);
    setText('');
    setAttachment(null);
  };

  const isSendDisabled = text.trim().length === 0 && !attachment;

  return (
    <View style={styles.wrapper}>
      {attachment && (
        <View style={styles.previewRow}>
          <Image source={{ uri: attachment.uri }} style={styles.previewImage} />
          <Text style={styles.previewText} numberOfLines={1}>
            Foto siap dikirim
          </Text>
          <TouchableOpacity
            onPress={() => setAttachment(null)}
            style={styles.previewRemove}
            accessibilityLabel="Hapus lampiran"
          >
            <Feather name="x" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={pickAttachment}
          accessibilityLabel="Lampirkan foto"
        >
          <Feather name="paperclip" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Ketik pesan..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={CHAT_CONFIG.MAX_MESSAGE_LENGTH}
          accessibilityLabel="Kolom ketik pesan"
        />

        <TouchableOpacity
          style={[styles.sendButton, isSendDisabled && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={isSendDisabled}
          accessibilityLabel="Kirim pesan"
        >
          <Ionicons name="paper-plane" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  previewImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.bg,
  },
  previewText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: colors.navy,
  },
  previewRemove: {
    padding: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: colors.bg,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: colors.navy,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: colors.disabled,
  },
});
