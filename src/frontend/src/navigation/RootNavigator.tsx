import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, ScreenName } from './types';
import { BottomTabNavigator } from './BottomTabNavigation';

import { LoginView } from '../views/auth/LoginView';
import { RegisterCustomerView } from '../views/auth/RegisterCustomerView';
import { RegisterProviderView } from '../views/auth/RegisterProviderView';
import { ProfileView } from '../views/profile/ProfileView';
import CreateTicketScreen from '../views/ticket/CreateTicketScreen';
import MyTicketsScreen from '../views/ticket/MyTicketsScreen';
import TicketDetailScreen from '../views/ticket/TicketDetailScreen';
import CSDashboardScreen from '../views/ticket/CSDashboardScreen';
import { ServiceRegistrationView } from '../views/service/ServiceRegistrationView';
import { SearchRecommendationView } from '../views/home/SearchRecommendationView';
import { SearchResultView } from '../views/home/SearchResultView';
import { CustomerChatView } from '../views/chat/CustomerChatView';
import { ProviderChatView } from '../views/chat/ProviderChatView';
import { NotificationView } from '../views/chat/notifications/NotificationView';
import { ProviderHistoryView } from '../views/history/ProviderHistoryView';
import { RatingView } from '../views/rating/RatingView';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F4F8F7' },
      }}
    >
      {/* UI-01: Layar Login */}
      <Stack.Screen name="Login">
        {({ navigation }) => (
          <LoginView
            onNavigate={(target: ScreenName) => {
              if (target === 'Home') {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main', params: { screen: 'Beranda' } }],
                });
              } else if (target === 'ProviderHistory') {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main', params: { screen: 'Riwayat' } }],
                });
              } else if (target === 'CSHome') {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'CSDashboard' }],
                });
              } else if (target === 'RegisterCustomer') {
                navigation.navigate('RegisterCustomer');
              } else if (target === 'RegisterProvider') {
                navigation.navigate('RegisterProvider');
              }
            }}
          />
        )}
      </Stack.Screen>

      {/* UI-02: Buat Akun Pengguna (Pelanggan) */}
      <Stack.Screen name="RegisterCustomer">
        {({ navigation }) => (
          <RegisterCustomerView
            onNavigate={(target: ScreenName) => {
              if (target === 'Home') {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main', params: { screen: 'Beranda' } }],
                });
              } else if (target === 'Login') {
                navigation.navigate('Login');
              } else if (target === 'RegisterProvider') {
                navigation.navigate('RegisterProvider');
              }
            }}
          />
        )}
      </Stack.Screen>

      {/* UI-03: Buat Akun Jasa (Penyedia Jasa) */}
      <Stack.Screen name="RegisterProvider">
        {({ navigation }) => (
          <RegisterProviderView
            onNavigate={(target, params) => {
              if (target === 'ServiceRegistration') {
                navigation.navigate('ServiceRegistration', params);
              } else if (target === 'Login') {
                navigation.navigate('Login');
              } else if (target === 'RegisterCustomer') {
                navigation.navigate('RegisterCustomer');
              }
            }}
          />
        )}
      </Stack.Screen>

      {/* Navigasi Utama (Tab: Beranda UI-04, Riwayat UI-11/UI-12, Chat UI-07) */}
      <Stack.Screen name="Main" component={BottomTabNavigator} />

      {/* UI-14: Profil Saya */}
      <Stack.Screen name="Profile">
        {({ navigation }) => (
          <ProfileView
            onBack={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('Main');
              }
            }}
            onLogoutSuccess={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
          />
        )}
      </Stack.Screen>

      {/* UI-12: Riwayat Pesanan Pemberi Jasa (Standalone Route) */}
      <Stack.Screen name="ProviderHistory" component={ProviderHistoryView} />

      {/* UI-16: Pendaftaran & Verifikasi Jasa */}
      <Stack.Screen
        name="ServiceRegistration"
        component={ServiceRegistrationView}
      />

      {/* UI-05 & UI-06: Pencarian dan Rekomendasi */}
      <Stack.Screen
        name="SearchRecommendation"
        component={SearchRecommendationView}
      />
      <Stack.Screen name="SearchResult" component={SearchResultView} />

      {/* UI-08 & UI-13: Chat Pelanggan & Penyedia Jasa */}
      <Stack.Screen name="CustomerChat" component={CustomerChatView} />
      <Stack.Screen name="ProviderChat" component={ProviderChatView} />

      {/* UI-15: Notifikasi */}
      <Stack.Screen name="Notification" component={NotificationView} />

      {/* UI-09, UI-10, UI-17, UI-18: Tiket Bantuan & Layanan Pelanggan */}
      <Stack.Screen
        name="CreateTicket"
        component={CreateTicketScreen}
        options={{
          headerShown: true,
          title: 'Buat Pengaduan',
          headerStyle: { backgroundColor: '#1A5C4D' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="MyTickets"
        component={MyTicketsScreen}
        options={{
          headerShown: true,
          title: 'Daftar Tiket Saya',
          headerStyle: { backgroundColor: '#1A5C4D' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
        options={{
          headerShown: true,
          title: 'Ruang Diskusi Tiket',
          headerStyle: { backgroundColor: '#1A5C4D' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen
        name="CSDashboard"
        component={CSDashboardScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Meja Kerja CS',
          headerStyle: { backgroundColor: '#1A5C4D' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity
              testID="cs-profile-avatar-button"
              style={styles.csHeaderProfileBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
            >
              <Text style={styles.csHeaderProfileText}>Profil</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="CSHome"
        component={CSDashboardScreen}
        options={({ navigation }) => ({
          headerShown: true,
          title: 'Meja Kerja CS',
          headerStyle: { backgroundColor: '#1A5C4D' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity
              style={styles.csHeaderProfileBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.8}
            >
              <Text style={styles.csHeaderProfileText}>Profil</Text>
            </TouchableOpacity>
          ),
        })}
      />
      {/* Penilaian & Ulasan (UC10 - UI-11) */}
      <Stack.Screen
        name="Rating"
        component={RatingView}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  csHeaderProfileBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  csHeaderProfileText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default RootNavigator;
