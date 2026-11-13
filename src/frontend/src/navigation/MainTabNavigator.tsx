import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MainTabName, ScreenName } from './types';
import HomeView from '../views/home/HomeView';
import CustomerHistoryView from '../views/history/CustomerHistoryView';
import ConversationListView from '../views/chat/ConversationListView';

export interface MainTabNavigatorProps {
  onNavigate: (screen: ScreenName) => void;
}

/**
 * Bottom Navigation (UI-04-14, UI-07-08, UI-10-07): Beranda, Riwayat, Chat
 */
export const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<MainTabName>('HomeTab');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'HistoryTab':
        return <CustomerHistoryView />;
      case 'ChatTab':
        return <ConversationListView />;
      case 'HomeTab':
      default:
        return <HomeView onNavigate={onNavigate} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentArea}>{renderTabContent()}</View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          testID="tab-beranda"
          style={styles.tabItem}
          onPress={() => setActiveTab('HomeTab')}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'HomeTab' && styles.tabLabelActive,
            ]}
          >
            Beranda
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="tab-riwayat"
          style={styles.tabItem}
          onPress={() => setActiveTab('HistoryTab')}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'HistoryTab' && styles.tabLabelActive,
            ]}
          >
            Riwayat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="tab-chat"
          style={styles.tabItem}
          onPress={() => setActiveTab('ChatTab')}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'ChatTab' && styles.tabLabelActive,
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F8',
  },
  contentArea: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#0F8A75',
    fontWeight: '800',
  },
});

export default MainTabNavigator;
