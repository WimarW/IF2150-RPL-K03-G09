import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface MessageInputProps {
  onSend: (text: string) => void;
  onPressAttach?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = React.memo(({
  onSend,
  onPressAttach,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  const isSendDisabled = text.trim().length === 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.attachButton}
        onPress={onPressAttach}
        accessibilityLabel="Lampirkan file atau foto"
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
        maxLength={1000}
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
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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