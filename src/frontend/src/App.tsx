import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './navigation/RootNavigator';
import { UnreadProvider } from './context/UnreadContext';
import { AuthControllerProvider } from './controllers/useAuthController';

export const App: React.FC = () => {
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
};

export default App;
