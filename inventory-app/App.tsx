import React, { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/lib/react-query';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { BottomNavigation, TabType } from './src/components/ui/BottomNavigation';
import { loadFonts } from './src/utils/fonts';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('inventory');

  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading fonts:', error);
        setFontsLoaded(true); // Continue anyway
      }
    };

    loadAppFonts();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const renderCurrentScreen = () => {
    switch (activeTab) {
      case 'inventory':
        return <ProductsScreen />;
      case 'camera':
        return <CameraScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <ProductsScreen />;
    }
  };

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showSplash) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onAnimationComplete={handleSplashComplete} />
      </>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.content}>
          {renderCurrentScreen()}
        </View>
        <BottomNavigation
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
    // Don't use custom font for loading text since fonts aren't loaded yet
  },
});
