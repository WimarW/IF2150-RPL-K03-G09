import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { UnreadProvider } from './src/context/UnreadContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <UnreadProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </UnreadProvider>
    </SafeAreaProvider>
  );
}