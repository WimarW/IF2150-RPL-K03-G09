import React from 'react';
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
import { useNotificationController } from '../../../controllers/useNotificationController';
import { NotificationCard } from '../../../components/notifications/NotificationCard';
import { Snackbar } from '../../../components/common/Snackbar';
import { colors } from '../../../theme/colors';
import { AppNotification } from '../../../types/chat';

export const NotificationView: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    notifications,
    isLoading,
    isRefreshing,
    error,
    snackbarMessage,
    setSnackbarMessage,
    loadNotifications,
    markAllAsRead,
    handleNotificationPress,
    onRefresh,
  } = useNotificationController();

  useFocusEffect(
    React.useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const hasUnread = notifications.some((n: AppNotification) => !n.statusBaca);

  const onItemPress = (item: AppNotification) => {
    const navResult = handleNotificationPress(item);
    if (navResult) {
      navigation.navigate(navResult.targetScreen, navResult.params);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Kembali"
        >
          <Feather name="chevron-left" size={20} color={colors.navy} />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Notifikasi</Text>
            <Text style={styles.subtitle}>Pembaruan terbaru untukmu</Text>
          </View>
          <TouchableOpacity
            onPress={markAllAsRead}
            disabled={!hasUnread}
            accessibilityLabel="Tandai semua notifikasi dibaca"
          >
            <Text style={[styles.markReadText, !hasUnread && styles.disabledText]}>
              Tandai dibaca
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && !isRefreshing ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.idNotifikasi}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>Belum ada notifikasi</Text>
              </View>
            }
            renderItem={({ item }) => (
              <NotificationCard notification={item} onPress={() => onItemPress(item)} />
            )}
          />
        )}
      </View>

      <Snackbar message={snackbarMessage} onDismiss={() => setSnackbarMessage(null)} />
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
    paddingTop: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.navy,
    marginLeft: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  markReadText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  disabledText: {
    color: colors.disabled,
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
  },
});