import React, { useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { KeyboardAwareView } from '../../components/common/KeyboardAwareView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { DateSeparator } from '../../components/chat/DateSeparator';
import { MessageInput } from '../../components/chat/MessageInput';
import { ContractCard } from '../../components/chat/ContractCard';
import { Snackbar } from '../../components/common/Snackbar';
import { colors } from '../../theme/colors';
import { formatDateSeparatorLabel } from '../../utils/chatUtils';
import {
  ChatAttachment,
  ChatMessage,
  ContractFormErrors,
  ContractFormValues,
  DummyContract,
} from '../../types/chat';

export interface ChatRoomProps {
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
  onSend: (text: string, attachment?: ChatAttachment | null) => void;
  onRetry: (clientId: string) => void;
  onBack: () => void;
  onMorePress?: () => void;
  onPressAttach?: () => void;
  // Props integrasi Kontrak Pekerjaan (UI-08 & UI-09)
  contract?: DummyContract | null;
  contractFormValues?: ContractFormValues;
  contractFormErrors?: ContractFormErrors;
  isContractSubmitting?: boolean;
  onContractFieldChange?: (
    field: keyof ContractFormValues,
    value: string
  ) => void;
  onCreateContract?: () => void;
  onAcceptContract?: () => void;
  onRejectContract?: () => void;
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
  contract,
  contractFormValues,
  contractFormErrors,
  isContractSubmitting = false,
  onContractFieldChange,
  onCreateContract,
  onAcceptContract,
  onRejectContract,
}) => {
  // Render kartu kontrak di dalam aliran chat (UI-08-09 & UI-09-06..09)
  const timelineData = useMemo(() => {
    const list: any[] = [];
    let lastDateLabel = '';
    let contractInserted = false;

    const shouldRenderContractInStream = !isCS && contract !== null;
    const targetContractIndex =
      messages.length >= 3 ? 2 : Math.max(0, messages.length - 1);

    messages.forEach((msg, idx) => {
      const dateLabel = formatDateSeparatorLabel(msg.waktuTerkirim);
      if (idx === 0 || dateLabel !== lastDateLabel) {
        list.push({ kind: 'date', label: dateLabel, key: `date-${idx}` });
        lastDateLabel = dateLabel;
      }

      list.push({
        kind: 'message',
        data: msg,
        key: msg.clientId || msg.idChat,
      });

      if (shouldRenderContractInStream && idx === targetContractIndex) {
        list.push({
          kind: 'contract',
          variant: variant === 'customer' ? 'detail' : 'decision',
          key:
            variant === 'customer'
              ? `contract-detail-${contract?.idKontrak ?? 'slot'}`
              : `contract-decision-${contract?.idKontrak ?? 'slot'}`,
        });
        contractInserted = true;
      }
    });

    // Apabila belum ada pesan chat sama sekali namun kontrak sudah ada/dibuat, tetap tampilkan di aliran chat
    if (shouldRenderContractInStream && !contractInserted) {
      list.push({
        kind: 'contract',
        variant: variant === 'customer' ? 'detail' : 'decision',
        key:
          variant === 'customer'
            ? `contract-detail-${contract?.idKontrak ?? 'slot'}`
            : `contract-decision-${contract?.idKontrak ?? 'slot'}`,
      });
    }

    return list;
  }, [messages, isCS, variant, contract]);

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

      <KeyboardAwareView style={styles.container} includeBottomInset={false}>
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
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              variant === 'customer' && !isCS ? (
                <View style={styles.topSlot}>
                  <ContractCard
                    variant="create"
                    contract={contract ?? undefined}
                    formValues={contractFormValues}
                    formErrors={contractFormErrors}
                    isSubmitting={isContractSubmitting}
                    onChangeField={onContractFieldChange}
                    onCreate={onCreateContract}
                  />
                </View>
              ) : undefined
            }
            renderItem={({ item }) => {
              if (item.kind === 'date') {
                return <DateSeparator label={item.label} />;
              }
              if (item.kind === 'contract') {
                return (
                  <ContractCard
                    variant={item.variant}
                    contract={contract ?? undefined}
                    isSubmitting={isContractSubmitting}
                    onAccept={onAcceptContract}
                    onReject={onRejectContract}
                  />
                );
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
      </KeyboardAwareView>

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
