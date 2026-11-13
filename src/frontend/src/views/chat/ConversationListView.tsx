import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useChatController } from '../../controllers/useChatController';
import { SearchField } from '../../components/chat/SearchField';
import { ConversationCard } from '../../components/chat/ConversationCard';
import { colors } from '../../theme/colors';
import { useSessionUser } from '../../services/api';

export const ConversationListView: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isPenyediaJasa } = useSessionUser();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    conversations,
    isLoading,
    isRefreshing,
    error,
    loadConversations,
    onRefresh,
  } = useChatController();

  useFocusEffect(
    React.useCallback(() => {
      loadConversations();
    }, [loadConversations])
  );

  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.partnerName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const handlePressCard = (
    partnerId: string,
    partnerName: string,
    isCS?: boolean,
    isOnline?: boolean
  ) => {
    if (isPenyediaJasa) {
      navigation.navigate('ProviderChat', {
        partnerId,
        partnerName,
        isCS,
        isOnline,
      });
      return;
    }
    navigation.navigate('CustomerChat', {
      idPemberiJasa: partnerId,
      namaPemberiJasa: partnerName,
      partnerId,
      partnerName,
      isCS,
      isOnline,
    });
  };

  const handlePencilClick = () => {
    if (!isPenyediaJasa) {
      // Pelanggan -> UI-05 / Rekomendasi Pencarian
      navigation.navigate('SearchRecommendation');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Pesan</Text>
            <Text style={styles.subtitle}>
              Obrolan dengan pemberi jasa & CS
            </Text>
          </View>
          <View style={styles.headerActions}>
            {/* UC08: buka daftar tiket laporan ke CS (pelanggan & pemberi jasa) */}
            <TouchableOpacity
              style={styles.pencilButton}
              onPress={() => navigation.navigate('MyTickets')}
              accessibilityLabel="Tiket laporan ke CS"
            >
              <Feather name="life-buoy" size={18} color={colors.navy} />
            </TouchableOpacity>
            {!isPenyediaJasa && (
              <TouchableOpacity
                style={[styles.pencilButton, styles.headerActionGap]}
                onPress={handlePencilClick}
                accessibilityLabel="Mulai percakapan baru"
              >
                <Feather name="edit-2" size={18} color={colors.navy} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <SearchField value={searchQuery} onChangeText={setSearchQuery} />

        {isLoading && !isRefreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => loadConversations()}
            >
              <Text style={styles.retryBtnText}>Coba lagi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            keyExtractor={(item) => item.partnerId}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? `Tidak ada hasil untuk “${searchQuery}”`
                    : 'Belum ada percakapan'}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <ConversationCard
                conversation={item}
                onPress={() =>
                  handlePressCard(
                    item.partnerId,
                    item.partnerName,
                    item.isCS,
                    item.isOnline
                  )
                }
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.navy,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionGap: {
    marginLeft: 8,
  },
  pencilButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 12,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryBtnText: {
    color: colors.white,
    fontWeight: '700',
  },
});

export default ConversationListView;
