import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigation';
import { ServiceRegistrationView } from
'../views/service/ServiceRegistrationView';
import { SearchRecommendationView } from
'../views/home/SearchRecommendationView';
import { SearchResultView } from '../views/home/SearchResultView';
import { CustomerChatView } from '../views/chat/CustomerChatView';
import { ProviderChatView } from '../views/chat/ProviderChatView';
import { NotificationView } from '../views/chat/notifications/NotificationView';
import CreateTicketScreen from '../views/ticket/CreateTicketScreen';
import MyTicketsScreen from '../views/ticket/MyTicketsScreen';
import TicketDetailScreen from '../views/ticket/TicketDetailScreen';
import CSDashboardScreen from '../views/ticket/CSDashboardScreen';
import { isCS } from '../services/ticketService';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={isCS() ? 'CSDashboard' : 'Main'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      {/* Katalog & Pencarian */}
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
      {/* Chat & Notifikasi */}
      <Stack.Screen
        name="CustomerChat"
        component={CustomerChatView}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ProviderChat"
        component={ProviderChatView}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationView}
        options={{ animation: 'slide_from_right' }}
      />
      {/* Tiket Laporan & Layanan Pelanggan */}
      <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
      <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
      <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
      <Stack.Screen name="CSDashboard" component={CSDashboardScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;