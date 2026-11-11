import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  ticketButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1ABC9C', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, marginTop: 20 },
  ticketText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
});
import { ConversationListView } from './chat/ConversationListView';

export const ChatScreen: React.FC = () => <ConversationListView />;
