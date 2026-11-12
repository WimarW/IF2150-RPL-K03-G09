/**
 * UI-09 Ruang Obrolan Penyedia Jasa
 * Traceability: UC04, UC05, KF09, KF11,
 * Kelas DPPL C17 KontrakPekerjaanUI, C18 KontrakPekerjaanController, C20 KomunikasiUI,
 * Antarmuka UI-09 (UI-09-01 s.d. UI-09-12)
 */

import React from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useChatController } from '../../controllers/useChatController';
import { useContractController } from '../../controllers/useContractController';
import { ChatRoom } from './ChatRoom';
import { CHAT_CONFIG } from '../../config/chatConfig';

export const ProviderChatView: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const partnerId = route.params?.partnerId || 'user-naufal-hasbialhaq';
  const partnerName = route.params?.partnerName || 'Naufal Hasbialhaq';
  const isCS = route.params?.isCS || false;

  const {
    messages,
    isLoading,
    error,
    snackbarMessage,
    setSnackbarMessage,
    loadChatHistory,
    sendChat,
    retrySend,
    markConversationRead,
  } = useChatController(partnerId, partnerName, isCS);

  const {
    contract,
    isSubmitting,
    loadContract,
    acceptContract,
    rejectContract,
  } = useContractController(isCS ? undefined : partnerId, {
    onShowSnackbar: setSnackbarMessage,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadChatHistory(partnerId);
      markConversationRead(partnerId);
      if (!isCS) {
        void loadContract(true);
      }
    }, [partnerId, isCS, loadChatHistory, markConversationRead, loadContract])
  );

  const handleMorePress = () => {
    setSnackbarMessage('Fitur Laporkan Pengguna (UI-15) segera hadir.');
  };

  const handlePressAttach = () => {
    if (!CHAT_CONFIG.ATTACHMENT_ENABLED) {
      setSnackbarMessage('Lampiran segera hadir.');
    }
  };

  return (
    <ChatRoom
      partnerName={partnerName}
      partnerId={partnerId}
      isCS={isCS}
      variant="provider"
      messages={messages}
      isLoading={isLoading}
      error={error}
      snackbarMessage={snackbarMessage}
      onDismissSnackbar={() => setSnackbarMessage(null)}
      onSend={sendChat}
      onRetry={retrySend}
      onBack={() => navigation.goBack()}
      onMorePress={handleMorePress}
      onPressAttach={handlePressAttach}
      contract={contract}
      isContractSubmitting={isSubmitting}
      onAcceptContract={() => {
        void acceptContract();
      }}
      onRejectContract={() => {
        void rejectContract();
      }}
    />
  );
};

export default ProviderChatView;
