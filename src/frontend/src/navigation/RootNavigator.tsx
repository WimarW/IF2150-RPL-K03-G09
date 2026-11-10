/**
 * Root Stack Navigator Aplikasi CariUang
 * Traceability: UC01 (Mendaftarkan Jasa), Antarmuka UI-16 (Daftar Penyedia Jasa)
 * Traceability Tambahan: UC02 (Memilih Jasa), Antarmuka UI-05 (Rekomendasi Pencarian),
 * UI-06 (Hasil Pencarian), UI-08 (Ruang Obrolan Pelanggan)
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigation';
import { ServiceRegistrationView } from '../views/service/ServiceRegistrationView';
import { SearchRecommendationView } from '../views/home/SearchRecommendationView';
import { SearchResultView } from '../views/home/SearchResultView';
import { CustomerChatView } from '../views/chat/CustomerChatView';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen
        name="ServiceRegistration"
        component={ServiceRegistrationView}
      />
      <Stack.Screen
        name="SearchRecommendation"
        component={SearchRecommendationView}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name="SearchResult"
        component={SearchResultView}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="CustomerChat"
        component={CustomerChatView}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
