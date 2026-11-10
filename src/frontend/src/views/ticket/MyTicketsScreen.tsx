import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { api, waktuRelatif } from '../../services/ticketService';

// Daftar tiket milik pelanggan / pemberi jasa (dibuka dari Daftar Pesan, UI-07)
export default function MyTicketsScreen({ navigation }: any) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try { setTickets(await api('/tickets/mine')); setError(''); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Tiket Saya</Text>
          <Text style={styles.subtitle}>Laporan ke Layanan Pelanggan</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('CreateTicket')}>
          <Feather name="plus" size={22} color="white" />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading ? <ActivityIndicator color="#1ABC9C" style={{ marginTop: 30 }} /> : (
        <FlatList
          data={tickets} keyExtractor={(i) => i.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
          ListEmptyComponent={<Text style={styles.empty}>Belum ada tiket laporan</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={1}>{item.desc}</Text>
                <Text style={styles.cardTime}>{waktuRelatif(item.createdAt)} • #{item.id}</Text>
              </View>
              <View style={[styles.badge, item.status === 'Selesai' ? { backgroundColor: '#E8F5E9' } : item.status === 'Diproses' ? { backgroundColor: '#E3F2FD' } : { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A237E' },
  subtitle: { fontSize: 14, color: '#78909C', marginTop: 4 },
  addBtn: { backgroundColor: '#1ABC9C', width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#C62828', marginBottom: 10 },
  empty: { textAlign: 'center', color: '#9E9E9E', marginTop: 40 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 1 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A237E' },
  cardDesc: { fontSize: 12, color: '#78909C', marginVertical: 4 },
  cardTime: { fontSize: 10, color: '#B0BEC5' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginLeft: 10 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#1A237E' },
});
