import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthControllerProvider } from './controllers/useAuthController';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <AuthControllerProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthControllerProvider>
  );
}
