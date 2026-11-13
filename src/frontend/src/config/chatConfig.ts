export const CHAT_CONFIG = {
  POLL_CHAT_ROOM_MS: 3000,
  POLL_CONVERSATIONS_MS: 10000,
  MAX_MESSAGE_LENGTH: 1000,
  ATTACHMENT_ENABLED: true,
  MAX_ATTACHMENT_BYTES: 5 * 1024 * 1024, // samakan dengan batas backend (upload.middleware.ts)
  // Mock untuk fitur kontrak di dalam chat (contractService)
  USE_MOCK: true,
  // Chat pelanggan <-> pemberi jasa memakai backend (/api/chats) agar riwayat tersimpan di database
  USE_MOCK_CHAT: false,
};