import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Compass, Ticket, QrCode, Wallet, Settings } from 'lucide-react-native';
import { COLORS } from '../theme/theme';

import { AuthContext } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ConfirmBookingScreen from '../screens/ConfirmBookingScreen';
import ScanQR from '../../ScanQR';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import TicketQRScreen from '../screens/TicketQRScreen';
import AIAssistantScreen from '../screens/AIAssistantScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import LiveBusTrackingScreen from '../screens/LiveBusTrackingScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={onPress}
  >
    <View style={{
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: COLORS.primary,
      borderWidth: 4,
      borderColor: COLORS.background,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    }}>
      {children}
    </View>
  </TouchableOpacity>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: COLORS.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: COLORS.cardBorder,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <Compass color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="Journey" 
        component={BookingScreen} 
        options={{
          tabBarIcon: ({ color }) => <Ticket color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="ScanQR" 
        component={ScanQR} 
        options={{
          tabBarIcon: () => <QrCode color={COLORS.surface} size={32} />,
          tabBarLabel: () => null,
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          )
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen} 
        options={{
          tabBarIcon: ({ color }) => <Wallet color={color} size={24} />
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color }) => <Settings color={color} size={24} />
        }}
      />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Journey" component={BookingScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="LiveTracking" component={LiveBusTrackingScreen} />
      <Stack.Screen name="ConfirmBooking" component={ConfirmBookingScreen} />
      <Stack.Screen name="TicketQR" component={TicketQRScreen} />
      <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
