import React, { useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { DateSeparator } from '../../components/chat/DateSeparator';
import { MessageInput } from '../../components/chat/MessageInput';
import { ContractCard } from '../../components/chat/ContractCard';
import { Snackbar } from '../../components/common/Snackbar';
import { colors } from '../../theme/colors';
import { formatDateSeparatorLabel } from '../../utils/chatUtils';
import { ChatMessage, DummyContract } from '../../types/chat';

interface ChatRoomProps {
  partnerName: string;
  partnerId: string;
  isOnline?: boolean;
  isCS?: boolean;
  variant: 'customer' | 'provider';
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  snackbarMessage: string | null;
  onDismissSnackbar: () => void;
  onSend: (text: string) => void;
  onRetry: (clientId: string) => void;
  onBack: () => void;
  onMorePress?: () => void;
  onPressAttach?: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  partnerName,
  partnerId,
  isOnline = true,
  isCS = false,
  variant,
  messages,
  isLoading,
  error,
  snackbarMessage,
  onDismissSnackbar,
  onSend,
  onRetry,
  onBack,
  onMorePress,
  onPressAttach,
}) => {
  // Render slot kontrak milik Raymond di posisi yang ditentukan
  const timelineData = useMemo(() => {
    const list: any[] = [];
    let lastDateLabel = '';

    messages.forEach((msg, idx) => {
      const dateLabel = formatDateSeparatorLabel(msg.waktuTerkirim);
      if (idx === 0 || dateLabel !== lastDateLabel) {
        list.push({ kind: 'date', label: dateLabel, key: `date-${idx}` });
        lastDateLabel = dateLabel;
      }

      list.push({ kind: 'message', data: msg, key: msg.clientId || msg.idChat });

      // Demokrasi Slot Kontrak Timeline untuk UI-08 dan UI-09
      if (!isCS && idx === 2) {
        if (variant === 'customer') {
          list.push({
            kind: 'contract',
            variant: 'detail',
            key: 'contract-detail-slot',
          });
        } else if (variant === 'provider') {
          list.push({
            kind: 'contract',
            variant: 'decision',
            key: 'contract-decision-slot',
          });
        }
      }
    });

    return list;
  }, [messages, isCS, variant]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ChatHeader
        partnerName={partnerName}
        isOnline={isOnline}
        isCS={isCS}
        variant={variant}
        onBack={onBack}
        onMorePress={onMorePress}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={timelineData}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              variant === 'customer' && !isCS ? (
                <View style={styles.topSlot}>
                  <ContractCard variant="create" />
                </View>
              ) : undefined
            }
            renderItem={({ item }) => {
              if (item.kind === 'date') {
                return <DateSeparator label={item.label} />;
              }
              if (item.kind === 'contract') {
                return <ContractCard variant={item.variant} />;
              }
              const isOutgoing = item.data.idPengguna !== partnerId;
              return (
                <ChatBubble
                  message={item.data}
                  isOutgoing={isOutgoing}
                  onRetry={onRetry}
                />
              );
            }}
          />
        )}

        <MessageInput onSend={onSend} onPressAttach={onPressAttach} />
      </KeyboardAvoidingView>

      <Snackbar message={snackbarMessage} onDismiss={onDismissSnackbar} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
  },
  topSlot: {
    paddingTop: 4,
    paddingBottom: 2,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
});