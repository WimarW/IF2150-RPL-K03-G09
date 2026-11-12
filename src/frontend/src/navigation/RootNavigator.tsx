import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  ScreenName,
  PendingProviderRegistration,
} from './types';
import LoginView from '../views/auth/LoginView';
import RegisterCustomerView from '../views/auth/RegisterCustomerView';
import RegisterProviderView from '../views/auth/RegisterProviderView';
import ProfileView from '../views/profile/ProfileView';
import ServiceRegistrationView from '../views/service/ServiceRegistrationView';
import ProviderHistoryView from '../views/history/ProviderHistoryView';
import CSHomeView from '../views/cs/CSHomeView';
import MainTabNavigator from './MainTabNavigator';

export const RootNavigator: React.FC = () => {
  const [historyStack, setHistoryStack] = useState<ScreenName[]>(['Login']);
  const [pendingProviderData, setPendingProviderData] =
    useState<PendingProviderRegistration | null>(null);

  const currentScreen = historyStack[historyStack.length - 1] || 'Login';

  const navigate = useCallback(
    (
      screen: ScreenName,
      params?: { pendingProvider?: PendingProviderRegistration }
    ) => {
      if (params?.pendingProvider !== undefined) {
        setPendingProviderData(params.pendingProvider);
      }
      setHistoryStack((prev) => [...prev, screen]);
    },
    []
  );

  const goBack = useCallback(() => {
    setHistoryStack((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, prev.length - 1);
    });
  }, []);

  const resetToScreen = useCallback((screen: ScreenName) => {
    setPendingProviderData(null);
    setHistoryStack([screen]);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login': // UI-01
        return <LoginView onNavigate={navigate} />;

      case 'RegisterCustomer': // UI-02
        return <RegisterCustomerView onNavigate={navigate} />;

      case 'RegisterProvider': // UI-03
        return <RegisterProviderView onNavigate={navigate} />;

      case 'ServiceRegistration': // UI-16 (Alur verifikasi / pendaftaran layanan jasa)
        return (
          <ServiceRegistrationView
            pendingProvider={pendingProviderData}
            onBack={goBack}
            onNavigate={navigate}
          />
        );

      case 'Profile': // UI-14
        return (
          <ProfileView
            onBack={goBack}
            onLogoutSuccess={(targetLoginScreen) =>
              resetToScreen(targetLoginScreen)
            }
          />
        );

      case 'ProviderHistory': // UI-12
        return <ProviderHistoryView onNavigate={navigate} />;

      case 'CSHome': // UI-17
        return <CSHomeView onNavigate={navigate} />;

      case 'Home': // UI-04
      default:
        return <MainTabNavigator onNavigate={navigate} />;
    }
  };

  return <View style={styles.root}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F4F9F8',
  },
});

export default RootNavigator;
