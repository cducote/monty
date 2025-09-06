import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export type TabType = 'inventory' | 'camera' | 'settings';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const tabs = [
    {
      id: 'inventory' as TabType,
      label: 'Inventory',
      icon: '📦',
    },
    {
      id: 'camera' as TabType,
      label: 'Camera',
      icon: '📷',
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: '⚙️',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && styles.activeTab,
          ]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text
            style={[
              styles.label,
              activeTab === tab.id && styles.activeLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingBottom: 8, // Reduced from 20 to 8
    paddingTop: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeTab: {
    // Active tab styling handled by text colors
  },
  icon: {
    fontSize: 22,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeLabel: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
