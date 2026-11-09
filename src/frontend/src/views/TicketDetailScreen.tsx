import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function TicketDetailScreen({ route, navigation }: any) {
  const { ticket } = route.params;
  const [reply, setReply] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'user', text: `Halo min, ${ticket.desc} Mohon dibantu ya min.`, time: '14.20', image: 'https://via.placeholder.com/150' },
    { id: '2', sender: 'cs', text: 'Halo kak, mohon tunggu sebentar.', time: '14.25' },
    { id: '3', sender: 'cs', text: 'Halo kak Naufal, kami sudah cek. Statusnya akan kami ubah ya.', time: '14.28' },
    { id: '4', sender: 'user', text: 'Baik min, ditunggu ya.', time: '14.30' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);

  const sendMessage = () => {
    if (reply.trim()) {
      setMessages([...messages, { id: Date.now().toString(), sender: 'cs', text: reply, time: 'Baru saja' }]);
      setReply('');
    }
  };

  const handleResolveTicket = () => {
    // Tombol untuk menutup tiket
    Alert.alert("Selesaikan Tiket", "Apakah masalah sudah teratasi dan tiket ini ingin ditutup?", [
      { text: "Batal", style: "cancel" },
      { text: "Ya, Tutup", onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <Feather name="chevron-left" size={24} color="#1A237E" />
          <View style={[styles.avatar, { backgroundColor: ticket.color }]}>
            <Text style={styles.avatarText}>{ticket.initials}</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Tiket #{ticket.id}</Text>
            <Text style={styles.headerSubtitle}>{ticket.title}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResolveTicket} style={styles.resolveButton}>
          <Text style={styles.resolveText}>Tutup Tiket</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Stream */}
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Laporan Awal / Card Tiket */}
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View style={[styles.avatar, { backgroundColor: ticket.color }]}>
              <Text style={styles.avatarText}>{ticket.initials}</Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.reportName}>{ticket.name}</Text>
              <Text style={styles.reportMeta}>Pelanggan • 12 Mei 2026, 14.20</Text>
            </View>
          </View>
          <Text style={styles.reportDesc}>{messages[0].text}</Text>
          {messages[0].image && (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image source={{ uri: messages[0].image }} style={styles.reportImage} />
            </TouchableOpacity>
          )}
        </View>

        {/* Render Chat Bubbles (Lewati index 0 karena sudah jadi report card) */}
        {messages.slice(1).map((msg) => (
          <View key={msg.id} style={[styles.messageRow, msg.sender === 'cs' ? styles.messageRowRight : styles.messageRowLeft]}>
            <View style={[styles.bubble, msg.sender === 'cs' ? styles.bubbleRight : styles.bubbleLeft]}>
              <Text style={[styles.messageText, msg.sender === 'cs' ? styles.textWhite : styles.textBlack]}>{msg.text}</Text>
            </View>
            <Text style={styles.timeText}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Feather name="paperclip" size={24} color="#78909C" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ketik balasan..."
          value={reply}
          onChangeText={setReply}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Feather name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal Perbesar Gambar */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
            <Feather name="x" size={30} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: messages[0].image }} style={styles.fullImage} resizeMode="contain" />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, paddingTop: 50, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
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
  messageText: { fontSize: 14, lineHeight: 20 },
  textBlack: { color: '#333' },
  textWhite: { color: 'white' },
  timeText: { fontSize: 10, color: '#9E9E9E', marginTop: 5 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#E0E0E0' },
  attachButton: { padding: 10 },
  input: { flex: 1, backgroundColor: '#F5F6FA', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100 },
  sendButton: { backgroundColor: '#1ABC9C', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  closeModalBtn: { position: 'absolute', top: 50, right: 20 },
  fullImage: { width: '100%', height: '80%' }
});