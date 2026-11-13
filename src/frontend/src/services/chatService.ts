import { apiPost, apiRequest, apiUpload, getCurrentUser } from './api';
import { ChatAttachment, ChatMessage, ConversationSummary } from '../types/chat';
import { CHAT_CONFIG } from '../config/chatConfig';

// ===== Bentuk respons backend (/api/chats) =====
interface ServerChatMessage {
  idChat: string;
  idPengguna: string;
  idPenerima: string;
  isiPesan: string;
  lampiranUrl?: string | null;
  waktuTerkirim: string;
  isChatTerbaca: boolean;
  statusChat?: string;
}

interface ServerConversation {
  idLawanBicara: string;
  namaLawanBicara: string;
  roleLawanBicara?: string;
  isiPesanTerakhir: string;
  waktuTerkirim: string;
  unreadCount: number;
}

const ATTACHMENT_PREVIEW_TEXT = '📷 Foto';

function toChatMessage(m: ServerChatMessage): ChatMessage {
  return {
    idChat: m.idChat,
    // Pesan dari server tidak membawa clientId; pakai idChat agar key stabil antara hasil kirim & polling
    clientId: m.idChat,
    idPengguna: m.idPengguna,
    idPenerima: m.idPenerima,
    isiPesan: m.isiPesan ?? '',
    lampiranUrl: m.lampiranUrl ?? null,
    waktuTerkirim: new Date(m.waktuTerkirim).toISOString(),
    isChatTerbaca: Boolean(m.isChatTerbaca),
    statusChat: 'SENT',
  };
}

function toConversationSummary(c: ServerConversation): ConversationSummary {
  return {
    partnerId: c.idLawanBicara,
    partnerName: c.namaLawanBicara,
    isCS: c.roleLawanBicara === 'LAYANAN_PELANGGAN',
    isOnline: false, // backend belum menyediakan status online lawan bicara
    lastMessage: c.isiPesanTerakhir,
    lastMessageAt: new Date(c.waktuTerkirim).toISOString(),
    unreadCount: c.unreadCount ?? 0,
  };
}

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
  'user-cs-support': [
    {
      idChat: 'msg-cs-1',
      clientId: 'c-cs-1',
      idPengguna: getCurrentUser().idPengguna,
      idPenerima: 'user-cs-support',
      isiPesan: 'Halo CS, saya ingin menanyakan status laporan saya.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
    {
      idChat: 'msg-cs-2',
      clientId: 'c-cs-2',
      idPengguna: 'user-cs-support',
      idPenerima: getCurrentUser().idPengguna,
      isiPesan: 'Tiket #A-2041 kamu sedang ditinjau.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 102).toISOString(),
      isChatTerbaca: false,
      statusChat: 'SENT',
    },
  ],
  'user-siti-rahayu': [
    {
      idChat: 'msg-siti-1',
      clientId: 'c-siti-1',
      idPengguna: getCurrentUser().idPengguna,
      idPenerima: 'user-siti-rahayu',
      isiPesan: 'Kak Siti, pembayarannya sudah saya selesaikan ya.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 60 * 24 - 1000 * 60 * 10).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
    {
      idChat: 'msg-siti-2',
      clientId: 'c-siti-2',
      idPengguna: 'user-siti-rahayu',
      idPenerima: getCurrentUser().idPengguna,
      isiPesan: 'Terima kasih ya kak, sudah dibayar 😊',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
  ],
  'user-agus-pratama': [
    {
      idChat: 'msg-agus-1',
      clientId: 'c-agus-1',
      idPengguna: getCurrentUser().idPengguna,
      idPenerima: 'user-agus-pratama',
      isiPesan: 'Pak Agus, kalau benerin keran bocor kira-kira berapa ya?',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 60 * 48 - 1000 * 60 * 15).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
    {
      idChat: 'msg-agus-2',
      clientId: 'c-agus-2',
      idPengguna: 'user-agus-pratama',
      idPenerima: getCurrentUser().idPengguna,
      isiPesan: 'Untuk keran bocor, ongkosnya 80k',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
  ],
  'user-naufal-hasbialhaq': [
    {
      idChat: 'msg-naufal-1',
      clientId: 'c-naufal-1',
      idPengguna: 'user-naufal-hasbialhaq',
      idPenerima: getCurrentUser().idPengguna,
      isiPesan: 'Halo kak Budi, saya butuh jasa bersih-bersih rumah 2 jam.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 26).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
    {
      idChat: 'msg-naufal-2',
      clientId: 'c-naufal-2',
      idPengguna: getCurrentUser().idPengguna,
      idPenerima: 'user-naufal-hasbialhaq',
      isiPesan: 'Halo kak Naufal, untuk 2 jam harganya Rp 100.000 ya.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
    {
      idChat: 'msg-naufal-3',
      clientId: 'c-naufal-3',
      idPengguna: 'user-naufal-hasbialhaq',
      idPenerima: getCurrentUser().idPengguna,
      isiPesan: 'Oke kak, saya buat kontraknya dulu ya.',
      waktuTerkirim: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
      isChatTerbaca: true,
      statusChat: 'SENT',
    },
  ],
};

export const chatService = {
  async getConversations(): Promise<ConversationSummary[]> {
    if (CHAT_CONFIG.USE_MOCK_CHAT) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...MOCK_CONVERSATIONS];
    }
    const data = await apiRequest<ServerConversation[]>('/chats/conversations');
    return (data ?? []).map(toConversationSummary);
  },

  async getChatHistory(partnerId: string): Promise<ChatMessage[]> {
    if (CHAT_CONFIG.USE_MOCK_CHAT) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_MESSAGES_STORE[partnerId] || [];
    }
    const data = await apiRequest<ServerChatMessage[]>(
      `/chats/${encodeURIComponent(partnerId)}`
    );
    return (data ?? []).map((m) => toChatMessage(m));
  },

  async sendChat(
    idPenerima: string,
    isiPesan: string,
    clientId: string,
    partnerName?: string,
    isCS = false,
    isOnline = true,
    attachment?: ChatAttachment | null
  ): Promise<ChatMessage> {
    if (CHAT_CONFIG.USE_MOCK_CHAT) {
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
        lampiranUrl: attachment?.uri ?? null,
        waktuTerkirim: new Date().toISOString(),
        isChatTerbaca: false,
        statusChat: 'SENT',
      };
      const lastMessage = isiPesan || (attachment ? ATTACHMENT_PREVIEW_TEXT : '');

      if (!MOCK_MESSAGES_STORE[idPenerima]) {
        MOCK_MESSAGES_STORE[idPenerima] = [];
      }
      MOCK_MESSAGES_STORE[idPenerima].push(newMsg);

      // Update conversation last message summary or add new conversation at top
      const convIndex = MOCK_CONVERSATIONS.findIndex((c) => c.partnerId === idPenerima);
      if (convIndex !== -1) {
        const existing = MOCK_CONVERSATIONS[convIndex];
        existing.lastMessage = lastMessage;
        existing.lastMessageAt = newMsg.waktuTerkirim;
        if (partnerName) existing.partnerName = partnerName;
        MOCK_CONVERSATIONS.splice(convIndex, 1);
        MOCK_CONVERSATIONS.unshift(existing);
      } else {
        MOCK_CONVERSATIONS.unshift({
          partnerId: idPenerima,
          partnerName: partnerName || 'Mitra Jasa',
          isCS,
          isOnline,
          lastMessage,
          lastMessageAt: newMsg.waktuTerkirim,
          unreadCount: 0,
        });
      }

      return newMsg;
    }

    if (attachment) {
      const form = new FormData();
      form.append('idPenerima', idPenerima);
      form.append('isiPesan', isiPesan);
      form.append('lampiran', {
        uri: attachment.uri,
        name: attachment.mimeType === 'image/png' ? 'lampiran.png' : 'lampiran.jpg',
        type: attachment.mimeType,
      } as unknown as Blob);
      const saved = await apiUpload<ServerChatMessage>('/chats', form);
      return toChatMessage(saved);
    }

    const saved = await apiPost<ServerChatMessage>('/chats', { idPenerima, isiPesan });
    return toChatMessage(saved);
  },

  async markConversationRead(partnerId: string): Promise<void> {
    if (CHAT_CONFIG.USE_MOCK_CHAT) {
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

    await apiRequest<void>(`/chats/${encodeURIComponent(partnerId)}/read`, { method: 'PATCH' });
  },
};