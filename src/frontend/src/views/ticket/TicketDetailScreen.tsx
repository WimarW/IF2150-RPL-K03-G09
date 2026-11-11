import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
  Image, Modal, Alert, ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { api, avatarColor, formatTanggal, formatWaktu, isCS as cekIsCS, imageUrl } from '../../services/ticketService';

const MAX_BYTES = 5 * 1024 * 1024;

// Dipakai CS (UI-18) dan pelapor (ruang obrolan tiket). Param: { ticketId }
export default function TicketDetailScreen({ route, navigation }: any) {
  const { ticketId } = route.params;
  const isCS = cekIsCS();
  const myRole: 'cs' | 'user' = isCS ? 'cs' : 'user';

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [attach, setAttach] = useState<{ uri: string; type: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const scrollRef = useRef<any>(null);

  const load = useCallback(async () => {
    try {
      const d = await api(`/tickets/${ticketId}`);
      setTicket(d.tiket); setMessages(d.pesan); setError('');
    } catch (e: any) { setError(e.message); }
  }, [ticketId]);

  // Polling 5 dtk agar balasan baru muncul (ganti websocket bila sudah tersedia)
  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const closed = ticket?.status === 'Selesai';
  // Laporan awal diambil dari data tiket; `messages` berisi seluruh percakapan mediasi
  const chat = messages;

  const pickAttachment = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Izin diperlukan', 'Izinkan akses galeri.');
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (res.canceled) return;
    const a = res.assets[0];
    const mime = a.mimeType ?? 'image/jpeg';
    if (mime !== 'image/jpeg' && mime !== 'image/png') return Alert.alert('Format tidak sesuai', 'Hanya JPG atau PNG.');
    if (a.fileSize && a.fileSize > MAX_BYTES) return Alert.alert('Ukuran terlalu besar', 'Maksimal 5MB.');
    setAttach({ uri: a.uri, type: mime });
  };

  const sendMessage = async () => {
    const text = reply.trim();
    if (!text || sending || closed) return;
    setSending(true);
    try {
      const form = new FormData();
      form.append('text', text);
      if (attach) form.append('lampiran', { uri: attach.uri, name: attach.type === 'image/png' ? 'l.png' : 'l.jpg', type: attach.type } as any);
      await api(isCS ? `/cs/tickets/${ticketId}/reply` : `/tickets/${ticketId}/messages`, { method: 'POST', form });
      setReply(''); setAttach(null);
      await load();
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) {
      Alert.alert('Gagal mengirim', e.message);
    } finally { setSending(false); }
  };

  const handleResolveTicket = () =>
    Alert.alert('Selesaikan Tiket', 'Apakah masalah sudah teratasi dan tiket ini ingin ditutup?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Ya, Tutup', onPress: async () => {
          try { await api(`/cs/tickets/${ticketId}/close`, { method: 'POST' }); navigation.goBack(); }
          catch (e: any) { Alert.alert('Gagal menutup tiket', e.message); }
        },
      },
    ]);

  if (!ticket) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        {error ? (
          <TouchableOpacity onPress={load}><Text style={{ color: '#C62828' }}>{error} (ketuk untuk coba lagi)</Text></TouchableOpacity>
        ) : <ActivityIndicator color="#1ABC9C" />}
      </View>
    );
  }

  const color = avatarColor(ticket.name);
  const reportImg = imageUrl(ticket.image);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <Feather name="chevron-left" size={24} color="#1A237E" />
          <View style={[styles.avatar, { backgroundColor: color }]}><Text style={styles.avatarText}>{ticket.initials}</Text></View>
          <View>
            <Text style={styles.headerTitle}>Tiket #{ticket.id}</Text>
            <Text style={styles.headerSubtitle}>{ticket.title} • {ticket.status}</Text>
          </View>
        </TouchableOpacity>
        {isCS && !closed && (
          <TouchableOpacity onPress={handleResolveTicket} style={styles.resolveButton}>
            <Text style={styles.resolveText}>Tutup Tiket</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView ref={scrollRef} style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={[styles.avatar, { backgroundColor: color }]}><Text style={styles.avatarText}>{ticket.initials}</Text></View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.reportName}>{ticket.name}</Text>
              <Text style={styles.reportMeta}>
                {ticket.reporterRole === 'PEMBERI_JASA' ? 'Pemberi Jasa' : 'Pelanggan'} • {formatTanggal(ticket.createdAt)}
              </Text>
            </View>
          </View>
          <Text style={styles.reportDesc}>{ticket.desc}</Text>
          {reportImg && (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={{ uri: reportImg }} style={styles.reportImage} />
            </TouchableOpacity>
          )}
        </View>

        {chat.map((msg) => {
          const mine = msg.sender === myRole;
          const img = imageUrl(msg.image);
          return (
            <View key={msg.id} style={[styles.messageRow, mine ? styles.messageRowRight : styles.messageRowLeft]}>
              <View style={[styles.bubble, mine ? styles.bubbleRight : styles.bubbleLeft]}>
                {img && <Image source={{ uri: img }} style={styles.bubbleImage} />}
                <Text style={[styles.messageText, mine ? styles.textWhite : styles.textBlack]}>{msg.text}</Text>
              </View>
              <Text style={styles.timeText}>{formatWaktu(msg.time)}</Text>
            </View>
          );
        })}

        {!closed && !isCS && !ticket.assignedTo && (
          <Text style={styles.closedText}>Tiket sedang menunggu petugas CS.</Text>
        )}
        {closed && <Text style={styles.closedText}>Tiket telah ditutup. Ruang obrolan tidak dapat digunakan lagi.</Text>}
      </ScrollView>

      {!closed && (
        <>
          {attach && (
            <View style={styles.attachPreview}>
              <Image source={{ uri: attach.uri }} style={{ width: 48, height: 48, borderRadius: 6 }} />
              <TouchableOpacity onPress={() => setAttach(null)}><Feather name="x" size={18} color="#78909C" /></TouchableOpacity>
            </View>
          )}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton} onPress={pickAttachment}>
              <Feather name="paperclip" size={24} color="#78909C" />
            </TouchableOpacity>
            <TextInput style={styles.input} placeholder="Ketik balasan..." value={reply} onChangeText={setReply} multiline />
            <TouchableOpacity style={[styles.sendButton, (!reply.trim() || sending) && { opacity: 0.5 }]} onPress={sendMessage} disabled={!reply.trim() || sending}>
              {sending ? <ActivityIndicator color="white" /> : <Feather name="send" size={20} color="white" />}
            </TouchableOpacity>
          </View>
        </>
      )}

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
            <Feather name="x" size={30} color="white" />
          </TouchableOpacity>
          {reportImg && <Image source={{ uri: reportImg }} style={styles.fullImage} resizeMode="contain" />}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingTop: 50, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A237E', marginLeft: 10 },
  headerSubtitle: { fontSize: 12, color: '#F39C12', marginLeft: 10, fontWeight: '600' },
  resolveButton: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  resolveText: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold' },
  avatar: { width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 12, fontWeight: 'bold', color: '#1A237E' },
  chatContainer: { flex: 1, padding: 15 },
  reportCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 1 },
  reportHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reportName: { fontSize: 14, fontWeight: 'bold', color: '#1A237E' },
  reportMeta: { fontSize: 11, color: '#9E9E9E' },
  reportDesc: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 10 },
  reportImage: { width: 80, height: 80, borderRadius: 8 },
  messageRow: { marginBottom: 15, maxWidth: '80%' },
  messageRowLeft: { alignSelf: 'flex-start' },
  messageRowRight: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  bubble: { padding: 12, borderRadius: 15 },
  bubbleLeft: { backgroundColor: 'white', borderBottomLeftRadius: 0 },
  bubbleRight: { backgroundColor: '#1ABC9C', borderBottomRightRadius: 0 },
  bubbleImage: { width: 140, height: 140, borderRadius: 8, marginBottom: 8 },
  messageText: { fontSize: 14, lineHeight: 20 },
  textBlack: { color: '#333' },
  textWhite: { color: 'white' },
  timeText: { fontSize: 10, color: '#9E9E9E', marginTop: 5 },
  closedText: { textAlign: 'center', color: '#78909C', fontSize: 12, marginTop: 10 },
  attachPreview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 8, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#E0E0E0' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#E0E0E0' },
  attachButton: { padding: 10 },
  input: { flex: 1, backgroundColor: '#F5F6FA', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100 },
  sendButton: { backgroundColor: '#1ABC9C', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  closeModalBtn: { position: 'absolute', top: 50, right: 20, zIndex: 1 },
  fullImage: { width: '100%', height: '80%' },
});
