import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeDashboard from './src/screens/(tabs)/index';
import TicketsScreen from './src/screens/(tabs)/tickets';
import ReportsScreen from './src/screens/(tabs)/reports';
import ProfileScreen from './src/screens/(tabs)/profile';
import ScanScreen from './src/screens/(tabs)/scan';
import PendingScreen from './src/screens/(tabs)/pending';
import OfflinePayScreen from './src/screens/(tabs)/offline-pay';
import UpiPayScreen from './src/screens/(tabs)/upi-pay';
import QrGenerateScreen from './src/screens/(tabs)/qr-generate';
import NfcPayScreen from './src/screens/(tabs)/nfc-pay';
import LoginScreen from './src/screens/(tabs)/login';
import RegisterScreen from './src/screens/(tabs)/register';
import { Colors } from './src/constants/Colors';
import * as Icon from './src/components/Icons';

const HomeIcon = Icon.House || Icon.Home;
const TicketIcon = Icon.Ticket;
const ChartIcon = Icon.ChartBar || Icon.BarChart3;
const UserIcon = Icon.User;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'register'

  if (!isAuthenticated) {
    return (
      <SafeAreaProvider style={styles.container}>
        {authScreen === 'login' ? (
          <LoginScreen 
            onLogin={() => setIsAuthenticated(true)} 
            onNavigateRegister={() => setAuthScreen('register')} 
          />
        ) : (
          <RegisterScreen 
            onNavigateLogin={() => setAuthScreen('login')}
          />
        )}
      </SafeAreaProvider>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'tickets':
        return <TicketsScreen onNavigate={(screen, data) => {
          if (data) setPaymentDetails(data);
          setActiveTab(screen);
        }} />;
      case 'reports':
        return <ReportsScreen />;
      case 'profile':
        return <ProfileScreen onLogout={() => setIsAuthenticated(false)} />;
      case 'scan':
        return <ScanScreen onBack={() => setActiveTab('home')} />;
      case 'pending':
        return <PendingScreen onBack={() => setActiveTab('home')} />;
      case 'home':
      default:
        return <HomeDashboard onNavigate={(screen) => setActiveTab(screen)} />;
    }
  };

  if (activeTab === 'scan') {
    return <ScanScreen onBack={() => setActiveTab('home')} />;
  }
  if (activeTab === 'pending') {
    return <PendingScreen onBack={() => setActiveTab('home')} />;
  }
  if (activeTab === 'offline-pay') {
    return <OfflinePayScreen onBack={() => setActiveTab('tickets')} onNavigate={(screen) => setActiveTab(screen)} details={paymentDetails} />;
  }
  if (activeTab === 'upi-pay') {
    return <UpiPayScreen onBack={() => setActiveTab('tickets')} />;
  }
  if (activeTab === 'qr-generate') {
    return <QrGenerateScreen onBack={() => setActiveTab('offline-pay')} details={paymentDetails} />;
  }
  if (activeTab === 'nfc-pay') {
    return <NfcPayScreen onBack={() => setActiveTab('offline-pay')} />;
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      
      {/* 4-Tab Bottom Navigation Bar (APSRTC Design System) */}
      <SafeAreaView edges={['bottom']} style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('home')}
          >
            {HomeIcon && <HomeIcon color={activeTab === 'home' ? Colors.primary : Colors.text.secondary} size={22} />}
            <Text style={[styles.tabLabel, { color: activeTab === 'home' ? Colors.primary : Colors.text.secondary }]}>
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('tickets')}
          >
            {TicketIcon && <TicketIcon color={activeTab === 'tickets' ? Colors.primary : Colors.text.secondary} size={22} />}
            <Text style={[styles.tabLabel, { color: activeTab === 'tickets' ? Colors.primary : Colors.text.secondary }]}>
              Tickets
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('reports')}
          >
            {ChartIcon && <ChartIcon color={activeTab === 'reports' ? Colors.primary : Colors.text.secondary} size={22} />}
            <Text style={[styles.tabLabel, { color: activeTab === 'reports' ? Colors.primary : Colors.text.secondary }]}>
              Reports
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab('profile')}
          >
            {UserIcon && <UserIcon color={activeTab === 'profile' ? Colors.primary : Colors.text.secondary} size={22} />}
            <Text style={[styles.tabLabel, { color: activeTab === 'profile' ? Colors.primary : Colors.text.secondary }]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
});
