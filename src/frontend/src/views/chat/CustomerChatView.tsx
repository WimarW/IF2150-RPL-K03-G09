/**
 * [Vinsensius Juan Setiady / Naufal Hasbialhaq] UI-08 Ruang Obrolan Pelanggan (Stub Sementara)
 * Traceability: UC02 (Langkah N4 pressChat), UC03, KF09, Kelas DPPL C20 KomunikasiUI, Antarmuka UI-08
 * Placeholder sementara agar alur UC02 N4 (pressChat) dapat diuji.
 * Implementasi penuh UI-08 / UC03 oleh Vinsensius Juan Setiady (KomunikasiUI C20).
 * Kontrak params RootStackParamList['CustomerChat'] HARUS dipertahankan.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UI_THEME } from '../../components/Header';
import { RootStackScreenProps } from '../../navigation/types';
import { getInitials } from '../../controllers/useCatalogController';

export const CustomerChatView: React.FC<
  RootStackScreenProps<'CustomerChat'>
> = ({ navigation, route }) => {
  const { namaPemberiJasa, isOnline = false } = route.params;
  const initials = getInitials(namaPemberiJasa);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* UI-08-01 & UI-08-02: Header Ruang Obrolan */}
      <View style={styles.header} testID="ui08-header">
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Kembali ke hasil pencarian"
          testID="ui08-back-button"
        >
          <Ionicons name="chevron-back" size={22} color={UI_THEME.textTitle} />
        </Pressable>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
          <View
            style={[
              styles.statusDot,
              isOnline ? styles.statusOnline : styles.statusOffline,
            ]}
          />
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.providerName} numberOfLines={1}>
            {namaPemberiJasa}
          </Text>
          <Text style={styles.statusText}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      {/* Empty State Tengah */}
      <View style={styles.body} testID="ui08-empty-body">
        <Ionicons name="chatbubbles-outline" size={44} color={UI_THEME.primary} />
        <Text style={styles.emptyText}>
          Mulai obrolan dengan {namaPemberiJasa} untuk menegosiasikan pekerjaan dan harga.
        </Text>
      </View>

      {/* UI-08-11: Baris Input Non-Aktif */}
      <View style={styles.footer}>
        <Text style={styles.soonLabel}>Fitur chat segera hadir</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ketik pesan..."
            placeholderTextColor={UI_THEME.textMuted}
            editable={false}
            testID="ui08-message-input"
          />
          <Ionicons name="send" size={20} color={UI_THEME.textMuted} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: UI_THEME.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: UI_THEME.surface, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: UI_THEME.border, gap: 10 },
  backBtn: { padding: 4 },
  pressed: { opacity: 0.7 },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#E3F5F1', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 15, fontWeight: '700', color: UI_THEME.textTitle },
  statusDot: { position: 'absolute', right: -2, bottom: -2, width: 11, height: 11, borderRadius: 6, borderWidth: 2, borderColor: UI_THEME.surface },
  statusOnline: { backgroundColor: UI_THEME.primary },
  statusOffline: { backgroundColor: '#B0B8C1' },
  headerInfo: { flex: 1 },
  providerName: { fontSize: 16, fontWeight: '700', color: UI_THEME.textTitle },
  statusText: { fontSize: 12, color: UI_THEME.textMuted, marginTop: 2 },
  body: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, gap: 12 },
  emptyText: { fontSize: 14, color: UI_THEME.textMuted, textAlign: 'center', lineHeight: 20 },
  footer: { backgroundColor: UI_THEME.surface, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: UI_THEME.border },
  soonLabel: { fontSize: 11, color: UI_THEME.textMuted, marginBottom: 6, textAlign: 'center' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: UI_THEME.background, borderRadius: 12, borderWidth: 1, borderColor: UI_THEME.border, paddingHorizontal: 12, height: 44 },
  input: { flex: 1, fontSize: 14, color: UI_THEME.textMuted },
});

export default CustomerChatView;
