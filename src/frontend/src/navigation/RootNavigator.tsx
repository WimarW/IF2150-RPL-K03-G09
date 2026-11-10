/**
 * Root Stack Navigator: tab utama + layar tiket laporan (UC08, UC09).
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigation';
import CreateTicketScreen from '../views/ticket/CreateTicketScreen';
import MyTicketsScreen from '../views/ticket/MyTicketsScreen';
import TicketDetailScreen from '../views/ticket/TicketDetailScreen';
import CSDashboardScreen from '../views/ticket/CSDashboardScreen';
import { isCS } from '../services/ticketService';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => (
  <Stack.Navigator initialRouteName={isCS() ? 'CSDashboard' : 'Main'} screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={BottomTabNavigator} />
    <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
    <Stack.Screen name="MyTickets" component={MyTicketsScreen} />
    <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
    <Stack.Screen name="CSDashboard" component={CSDashboardScreen} />
  </Stack.Navigator>
);

export default RootNavigator;
