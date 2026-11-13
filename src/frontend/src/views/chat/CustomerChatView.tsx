/**
 * [Vinsensius Juan Setiady & Raymond] UI-08 Ruang Obrolan Pelanggan
 * Traceability: UC02 (Langkah N4 pressChat), UC03, UC05, KF09, KF10, KF11,
 * Kelas DPPL C17 KontrakPekerjaanUI, C18 KontrakPekerjaanController, C20 KomunikasiUI,
 * Antarmuka UI-08 (UI-08-01 s.d. UI-08-12)
 * Kontrak params RootStackParamList['CustomerChat'] dipertahankan untuk kompatibilitas UC02.
 */

import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackScreenProps } from '../../navigation/types';
import { useChatController } from '../../controllers/useChatController';
import { useContractController } from '../../controllers/useContractController';
import { ChatRoom } from './ChatRoom';
import { CHAT_CONFIG } from '../../config/chatConfig';

export const CustomerChatView: React.FC<
  RootStackScreenProps<'CustomerChat'>
> = ({ navigation, route }) => {
  const partnerId =
    route.params?.partnerId ||
    route.params?.idPemberiJasa ||
    'user-budi-wijaya';
  const partnerName =
    route.params?.partnerName ||
    route.params?.namaPemberiJasa ||
    'Budi Wijaya';
  const isCS = route.params?.isCS ?? false;
  const isOnline = route.params?.isOnline ?? true;

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
  } = useChatController(partnerId, partnerName, isCS, isOnline);

  const {
    contract,
    formValues,
    formErrors,
    isSubmitting,
    loadContract,
    inputDetailPekerjaan,
    kirimInput,
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
      isOnline={isOnline}
      isCS={isCS}
      variant="customer"
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
      contractFormValues={formValues}
      contractFormErrors={formErrors}
      isContractSubmitting={isSubmitting}
      onContractFieldChange={inputDetailPekerjaan}
      onCreateContract={() => {
        void kirimInput();
      }}
    />
  );
};

export default CustomerChatView;
