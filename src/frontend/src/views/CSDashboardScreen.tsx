import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { api, avatarColor, waktuRelatif } from '../api';

type Filter = 'Semua' | 'Tiket Baru' | 'Diproses' | 'Selesai';

export default function CSDashboardScreen({ navigation }: any) {
  const [filter, setFilter] = useState<Filter>('Semua');
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({ tiketBaru: 0, diproses: 0, selesai: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (f: Filter) => {
    try {
      const [s, t] = await Promise.all([
        api('/api/cs/statistik'),
        api(`/api/cs/tiket${f === 'Semua' ? '' : `?status=${encodeURIComponent(f)}`}`),
      ]);
      setStats(s); setTickets(t); setError('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, []);

  // Muat ulang saat layar fokus / filter berubah, plus polling 15 dtk untuk tiket baru
  useFocusEffect(useCallback(() => {
    load(filter);
    const t = setInterval(() => load(filter), 15000);
    return () => clearInterval(t);
  }, [filter, load]));

  const toggle = (f: Filter) => { setLoading(true); setFilter(filter === f ? 'Semua' : f); };

  const badgeStyle = (s: string) => (s === 'Tiket Baru' ? styles.badgeOrange : s === 'Selesai' ? styles.badgeGreen : styles.badgeBlue);

  const renderTicket = ({ item }: any) => (
    <TouchableOpacity style={styles.ticketCard} onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}>
      <View style={[styles.avatar, { backgroundColor: avatarColor(item.name) }]}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>
      <View style={styles.ticketInfo}>
        <View style={styles.ticketHeaderRow}>
          <Text style={styles.ticketTitle}>{item.title}</Text>
          <View style={[styles.badge, badgeStyle(item.status)]}><Text style={styles.badgeText}>{item.status}</Text></View>
        </View>
        <Text style={styles.ticketDesc} numberOfLines={1}>{item.desc}</Text>
        <Text style={styles.ticketTime}>{waktuRelatif(item.createdAt)} • #{item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  const Stat = ({ label, n, color, f }: { label: string; n: number; color: string; f: Filter }) => (
    <TouchableOpacity style={[styles.statCard, filter === f && styles.statActive]} onPress={() => toggle(f)}>
      <View style={styles.statHeader}>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={[styles.dot, { backgroundColor: color }]} />
      </View>
      <Text style={styles.statNumber}>{n}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Beranda CS</Text>
          <Text style={styles.subtitle}>Pusat Bantuan & Laporan</Text>
        </View>
        <View style={styles.profileBadge}><Text style={styles.profileText}>CS</Text></View>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Tiket Baru" n={stats.tiketBaru} color="#F39C12" f="Tiket Baru" />
        <Stat label="Diproses" n={stats.diproses} color="#1ABC9C" f="Diproses" />
        <Stat label="Selesai" n={stats.selesai} color="#1A237E" f="Selesai" />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Tiket Terbaru {filter !== 'Semua' ? `(${filter})` : ''}</Text>
        <TouchableOpacity onPress={() => { setLoading(true); setFilter('Semua'); }}>
          <Text style={styles.seeAllText}>Lihat semua</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <TouchableOpacity onPress={() => load(filter)}><Text style={styles.errorText}>{error} (ketuk untuk coba lagi)</Text></TouchableOpacity>
      ) : null}

      {loading ? <ActivityIndicator color="#1ABC9C" style={{ marginTop: 30 }} /> : (
        <FlatList
          data={tickets} keyExtractor={(i) => i.id} renderItem={renderTicket}
          contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(filter); }} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Belum ada tiket</Text>}
        />
      )}

      <View style={styles.bottomNav}>
        <Text style={{ color: '#1ABC9C', fontSize: 12, fontWeight: '600' }}>Beranda</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1A237E' },
  subtitle: { fontSize: 14, color: '#78909C', marginTop: 5 },
  profileBadge: { backgroundColor: '#ECEFF1', width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  profileText: { fontWeight: 'bold', color: '#1A237E' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: 'white', width: '31%', padding: 15, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, borderWidth: 1, borderColor: 'transparent' },
  statActive: { borderColor: '#1ABC9C' },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statLabel: { fontSize: 12, color: '#1A237E', fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#F39C12' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A237E' },
  seeAllText: { fontSize: 14, color: '#1ABC9C', fontWeight: '600' },
  errorText: { color: '#C62828', fontSize: 12, marginBottom: 10 },
  emptyText: { textAlign: 'center', color: '#9E9E9E', marginTop: 30 },
  ticketCard: { backgroundColor: 'white', borderRadius: 12, padding: 15, flexDirection: 'row', marginBottom: 15, elevation: 1 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontWeight: 'bold', color: '#1A237E' },
  ticketInfo: { flex: 1 },
  ticketHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  ticketTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A237E', flexShrink: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeOrange: { backgroundColor: '#FFF3E0' },
  badgeBlue: { backgroundColor: '#E3F2FD' },
  badgeGreen: { backgroundColor: '#E8F5E9' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#1A237E' },
  ticketDesc: { fontSize: 12, color: '#78909C', marginBottom: 8 },
  ticketTime: { fontSize: 10, color: '#B0BEC5' },
  bottomNav: { borderTopWidth: 1, borderColor: '#E0E0E0', paddingVertical: 12, alignItems: 'center', backgroundColor: 'white' },
});
