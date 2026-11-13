import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { UnreadProvider } from './src/context/UnreadContext';
import { AuthControllerProvider } from './src/controllers/useAuthController';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthControllerProvider>
        <UnreadProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </UnreadProvider>
      </AuthControllerProvider>
    </SafeAreaProvider>
  );
}
