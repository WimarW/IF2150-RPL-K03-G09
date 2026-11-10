import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesan / Chat</Text>
      {/* Akses ke tiket laporan (UC08) sampai Daftar Pesan UI-07 selesai dibuat */}
      <TouchableOpacity style={styles.ticketButton} onPress={() => navigation.navigate('MyTickets')}>
        <Feather name="life-buoy" size={18} color="white" />
        <Text style={styles.ticketText}>Tiket Laporan ke CS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  ticketButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1ABC9C', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, marginTop: 20 },
  ticketText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
});
