import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * UI-07: Layar Daftar Pesan
 */
export const ConversationListView: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesan</Text>
      <Text style={styles.subtitle}>Obrolan dengan pemberi jasa & CS</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Budi Wijaya</Text>
        <Text style={styles.cardSub}>Siap, saya segera menuju lokasi.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F8',
    paddingHorizontal: 22,
    paddingTop: 44,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#13334C',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#13334C',
  },
  cardSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
});

export default ConversationListView;
