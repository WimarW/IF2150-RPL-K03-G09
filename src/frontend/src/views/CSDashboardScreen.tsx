import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

const mockTickets = [
  { id: 'A-2041', name: 'Naufal Hasbialhaq', title: 'Laporan Pembayaran', desc: 'Saya sudah transfer tapi status pesanan masih On Progress.', time: '10 menit lalu', status: 'Tiket Baru', initials: 'NH', color: '#E3F2FD' },
  { id: 'A-2040', name: 'Siti Rahayu', title: 'Kendala Aplikasi', desc: 'Aplikasi force close saat buka halaman kontrak.', time: '1 jam lalu', status: 'Diproses', initials: 'SR', color: '#E8F5E9' },
  { id: 'A-2039', name: 'Budi Wijaya', title: 'Perilaku Pengguna', desc: 'Pelanggan tidak membayar sesuai kesepakatan.', time: '2 jam lalu', status: 'Tiket Baru', initials: 'BW', color: '#FFF3E0' },
];

export default function CSDashboardScreen({ navigation }: any) {
  const [filter, setFilter] = useState('Semua'); // Semua, Tiket Baru, Diproses, Selesai

  const filteredTickets = filter === 'Semua' ? mockTickets : mockTickets.filter(t => t.status === filter);

  const renderTicket = ({ item }: any) => (
    <TouchableOpacity style={styles.ticketCard} onPress={() => navigation.navigate('TicketDetail', { ticket: item })}>
      <View style={[styles.avatar, { backgroundColor: item.color }]}>
        <Text style={styles.avatarText}>{item.initials}</Text>
      </View>
      <View style={styles.ticketInfo}>
        <View style={styles.ticketHeaderRow}>
          <Text style={styles.ticketTitle}>{item.title}</Text>
          <View style={[styles.badge, item.status === 'Tiket Baru' ? styles.badgeOrange : styles.badgeBlue]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.ticketDesc} numberOfLines={1}>{item.desc}</Text>
        <Text style={styles.ticketTime}>{item.time} • #{item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Profil CS */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Beranda CS</Text>
          <Text style={styles.subtitle}>Pusat Bantuan & Laporan</Text>
        </View>
        <View style={styles.profileBadge}>
          <Text style={styles.profileText}>CS</Text>
        </View>
      </View>

      {/* Kartu Statistik */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statCard} onPress={() => setFilter(filter === 'Tiket Baru' ? 'Semua' : 'Tiket Baru')}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Tiket Baru</Text>
            <View style={[styles.dot, { backgroundColor: '#F39C12' }]} />
          </View>
          <Text style={styles.statNumber}>12</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={() => setFilter(filter === 'Diproses' ? 'Semua' : 'Diproses')}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Diproses</Text>
            <View style={[styles.dot, { backgroundColor: '#1ABC9C' }]} />
          </View>
          <Text style={styles.statNumber}>5</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statCard} onPress={() => setFilter(filter === 'Selesai' ? 'Semua' : 'Selesai')}>
          <View style={styles.statHeader}>
            <Text style={styles.statLabel}>Selesai</Text>
            <View style={[styles.dot, { backgroundColor: '#1A237E' }]} />
          </View>
          <Text style={styles.statNumber}>28</Text>
        </TouchableOpacity>
      </View>

      {/* List Tiket */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Tiket Terbaru {filter !== 'Semua' ? `(${filter})` : ''}</Text>
        <TouchableOpacity onPress={() => setFilter('Semua')}>
          <Text style={styles.seeAllText}>Lihat semua</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTickets}
        keyExtractor={item => item.id}
        renderItem={renderTicket}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Nav Simulasi */}
      <View style={styles.bottomNav}>
        <Feather name="home" size={24} color="#1ABC9C" />
        <Text style={{ color: '#1ABC9C', fontSize: 10, marginTop: 4 }}>Beranda</Text>
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
  statCard: { backgroundColor: 'white', width: '31%', padding: 15, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statLabel: { fontSize: 12, color: '#1A237E', fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#F39C12' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A237E' },
  seeAllText: { fontSize: 14, color: '#1ABC9C', fontWeight: '600' },
  ticketCard: { backgroundColor: 'white', borderRadius: 12, padding: 15, flexDirection: 'row', marginBottom: 15, elevation: 1 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { fontWeight: 'bold', color: '#1A237E' },
  ticketInfo: { flex: 1 },
  ticketHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  ticketTitle: { fontSize: 14, fontWeight: 'bold', color: '#1A237E' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeOrange: { backgroundColor: '#FFF3E0' },
  badgeBlue: { backgroundColor: '#E3F2FD' },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#1A237E' },
  ticketDesc: { fontSize: 12, color: '#78909C', marginBottom: 8 },
  ticketTime: { fontSize: 10, color: '#B0BEC5' },
  bottomNav: { borderTopWidth: 1, borderColor: '#E0E0E0', paddingVertical: 10, alignItems: 'center', backgroundColor: 'white' }
});