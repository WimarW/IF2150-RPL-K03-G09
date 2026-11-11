import { apiGet, apiPost, apiRequest, getCurrentUser } from './api';
import { ChatMessage, ConversationSummary } from '../types/chat';
import { CHAT_CONFIG } from '../config/chatConfig';

let MOCK_FAIL_NEXT_SEND = false;

export function setMockFailNextSend(fail: boolean) {
  MOCK_FAIL_NEXT_SEND = fail;
}

export function getMockFailNextSend(): boolean {
  return MOCK_FAIL_NEXT_SEND;
}

const MOCK_CONVERSATIONS: ConversationSummary[] = [
  {
    partnerId: 'user-budi-wijaya',
    partnerName: 'Budi Wijaya',
    isCS: false,
    isOnline: true,
    lastMessage: 'Oke kak, saya berangkat sekarang ya.',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    unreadCount: 2,
  },
  {
    partnerId: 'user-cs-support',
    partnerName: 'Layanan Pelanggan',
    isCS: true,
    isOnline: false,
    lastMessage: 'Tiket #A-2041 kamu sedang ditinjau.',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 102).toISOString(),
    unreadCount: 1,
  },
  {
    partnerId: 'user-siti-rahayu',
    partnerName: 'Siti Rahayu',
    isCS: false,
    isOnline: true,
    lastMessage: 'Terima kasih ya kak, sudah dibayar 😊',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unreadCount: 0,
  },
  {
    partnerId: 'user-agus-pratama',
    partnerName: 'Agus Pratama',
    isCS: false,
    isOnline: false,
    lastMessage: 'Untuk keran bocor, ongkosnya 80k',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    unreadCount: 0,
  },
];

const MOCK_MESSAGES_STORE: Record<string, ChatMessage[]> = {
  'user-budi-wijaya': [
    {
      idChat: 'msg-1',
      clientId: 'c-1',
      idPengguna: 'user-budi-wijaya',
      idPenerima: getCurrentUser().idPengguna,
      isiPesan: 'Halo kak, untuk bersih-bersih rumah 2 jam jadi Rp 100.000 ya.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
    {
      idChat: 'msg-2',
      clientId: 'c-2',
      idPengguna: getCurrentUser().idPengguna,
      idPenerima: 'user-budi-wijaya',
      isiPesan: 'Oke kak, bisa jam segini langsung berangkat?',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
    {
      idChat: 'msg-3',
      clientId: 'c-3',
      idPengguna: 'user-budi-wijaya',
      idPenerima: getCurrentUser().idPengguna,
      isiPesan: 'Bisa kak, tolong input detail pekerjaannya di aplikasi ya.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
    {
      idChat: 'msg-4',
      clientId: 'c-4',
      idPengguna: getCurrentUser().idPengguna,
      idPenerima: 'user-budi-wijaya',
      isiPesan: 'Sudah saya input ya kak kontraknya. Saya tunggu di rumah.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
    {
      idChat: 'msg-5',
      clientId: 'c-5',
      idPengguna: 'user-budi-wijaya',
      idPenerima: getCurrentUser().idPengguna,
      isiPesan: 'Oke kak, saya berangkat sekarang ya.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      isChatTerbaca: false,
      statusChat: 'SENT',
    },
  ],
};

export const chatService = {
  async getConversations(): Promise<ConversationSummary[]> {
    if (CHAT_CONFIG.USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...MOCK_CONVERSATIONS];
    }
    return apiGet<ConversationSummary[]>('/chats');
  },

  async getChatHistory(partnerId: string): Promise<ChatMessage[]> {
    if (CHAT_CONFIG.USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_MESSAGES_STORE[partnerId] || [];
    }
    return apiGet<ChatMessage[]>(`/chats/${partnerId}`);
  },

  async sendChat(idPenerima: string, isiPesan: string, clientId: string): Promise<ChatMessage> {
    if (CHAT_CONFIG.USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (MOCK_FAIL_NEXT_SEND) {
        MOCK_FAIL_NEXT_SEND = false; // Reset after failing once
        throw new Error('Network error simulated');
      }

      const newMsg: ChatMessage = {
        idChat: `srv-${Date.now()}`,
        clientId,
        idPengguna: getCurrentUser().idPengguna,
        idPenerima,
        isiPesan,
        waktuTerkirim: new Date().toISOString(),
        isChatTerbaca: false,
        statusChat: 'SENT',
      };

      if (!MOCK_MESSAGES_STORE[idPenerima]) {
        MOCK_MESSAGES_STORE[idPenerima] = [];
      }
      MOCK_MESSAGES_STORE[idPenerima].push(newMsg);

      // Update conversation last message summary
      const conv = MOCK_CONVERSATIONS.find((c) => c.partnerId === idPenerima);
      if (conv) {
        conv.lastMessage = isiPesan;
        conv.lastMessageAt = newMsg.waktuTerkirim;
      }

      return newMsg;
    }

    return apiPost<ChatMessage>('/chats', { idPenerima, isiPesan, clientId });
  },

  async markConversationRead(partnerId: string): Promise<void> {
    if (CHAT_CONFIG.USE_MOCK) {
      const conv = MOCK_CONVERSATIONS.find((c) => c.partnerId === partnerId);
      if (conv) {
        conv.unreadCount = 0;
      }
      if (MOCK_MESSAGES_STORE[partnerId]) {
        MOCK_MESSAGES_STORE[partnerId].forEach((m) => {
          m.isChatTerbaca = true;
        });
      }
      return;
    }

    await apiRequest<void>(`/chats/${partnerId}/read`, { method: 'PATCH' });
  },
};