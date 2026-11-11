import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { ChatMessage, ConversationSummary } from '../types/chat';
import { chatService } from '../services/chatService';
import { CHAT_CONFIG } from '../config/chatConfig';
import { mergeMessages } from '../utils/chatUtils';
import { useUnreadCounts } from '../context/UnreadContext';

export function useChatController(partnerId?: string) {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const { setUnreadMessages, decrementUnreadMessagesBy } = useUnreadCounts();
  const appStateRef = useRef<AppStateStatus>((AppState.currentState as AppStateStatus) || 'active');

  const loadConversations = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      const totalUnread = data.reduce((acc, c) => acc + c.unreadCount, 0);
      setUnreadMessages(totalUnread);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat percakapan.';
      if (!isSilent) setError(msg);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [setUnreadMessages]);

  const loadChatHistory = useCallback(async (pId: string, isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setError(null);
    try {
      const serverMsgs = await chatService.getChatHistory(pId);
      setMessages((prevLocal) => mergeMessages(prevLocal, serverMsgs));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat pesan.';
      if (!isSilent) setError(msg);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, []);

  const markConversationRead = useCallback(async (pId: string) => {
    // Optimistic
    setConversations((prev) =>
      prev.map((c) => {
        if (c.partnerId === pId && c.unreadCount > 0) {
          decrementUnreadMessagesBy(c.unreadCount);
          return { ...c, unreadCount: 0 };
        }
        return c;
      })
    );

    try {
      await chatService.markConversationRead(pId);
    } catch {
      // Rollback ringan
    }
  }, [decrementUnreadMessagesBy]);

  const sendChat = useCallback(
    async (text: string) => {
      if (!partnerId) return;

      const trimmed = text.trim();
      if (!trimmed) return;
      if (trimmed.length > CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
        setSnackbarMessage(`Pesan terlalu panjang (maks ${CHAT_CONFIG.MAX_MESSAGE_LENGTH} karakter).`);
        return;
      }

      const clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const optimisticMsg: ChatMessage = {
        idChat: clientId,
        clientId,
        idPengguna: 'current-user-id', // will be matched in backend
        idPenerima: partnerId,
        isiPesan: trimmed,
        waktuTerkirim: new Date().toISOString(),
        isChatTerbaca: false,
        statusChat: 'SENDING',
      };

      // 2. Optimistic Update
      setMessages((prev) => [...prev, optimisticMsg]);

      try {
        const result = await chatService.sendChat(partnerId, trimmed, clientId);
        // 3. Sukses
        setMessages((prev) =>
          prev.map((m) => (m.clientId === clientId ? { ...result, statusChat: 'SENT' } : m))
        );
      } catch {
        // 5.2 Skenario Alternatif 1: Gagal
        setMessages((prev) =>
          prev.map((m) => (m.clientId === clientId ? { ...m, statusChat: 'FAILED' } : m))
        );
        setSnackbarMessage('Pesan tidak terkirim. Periksa koneksimu lalu coba lagi.');
      }
    },
    [partnerId]
  );

  const retrySend = useCallback(
    async (clientId: string) => {
      if (!partnerId) return;
      const targetMsg = messages.find((m) => m.clientId === clientId);
      if (!targetMsg) return;

      // Reset state to SENDING
      setMessages((prev) =>
        prev.map((m) => (m.clientId === clientId ? { ...m, statusChat: 'SENDING' } : m))
      );

      try {
        const result = await chatService.sendChat(partnerId, targetMsg.isiPesan, clientId);
        setMessages((prev) =>
          prev.map((m) => (m.clientId === clientId ? { ...result, statusChat: 'SENT' } : m))
        );
      } catch {
        setMessages((prev) =>
          prev.map((m) => (m.clientId === clientId ? { ...m, statusChat: 'FAILED' } : m))
        );
        setSnackbarMessage('Pesan tidak terkirim. Periksa koneksimu lalu coba lagi.');
      }
    },
    [partnerId, messages]
  );

  // Polling AppState management
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  // Polling for Chat Room (3s) or Conversations (10s)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (partnerId) {
      interval = setInterval(() => {
        if (appStateRef.current === 'active') {
          loadChatHistory(partnerId, true);
        }
      }, CHAT_CONFIG.POLL_CHAT_ROOM_MS);
    } else {
      interval = setInterval(() => {
        if (appStateRef.current === 'active') {
          loadConversations(true);
        }
      }, CHAT_CONFIG.POLL_CONVERSATIONS_MS);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [partnerId, loadChatHistory, loadConversations]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    if (partnerId) {
      await loadChatHistory(partnerId, true);
    } else {
      await loadConversations(true);
    }
    setIsRefreshing(false);
  }, [partnerId, loadChatHistory, loadConversations]);

  return {
    conversations,
    messages,
    isLoading,
    isRefreshing,
    error,
    snackbarMessage,
    setSnackbarMessage,
    loadConversations,
    loadChatHistory,
    sendChat,
    retrySend,
    markConversationRead,
    onRefresh,
  };
}