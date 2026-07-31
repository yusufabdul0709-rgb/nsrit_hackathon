import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import * as Icon from '../../components/Icons';

const HomeIcon = Icon.House;
const TicketIcon = Icon.Ticket;
const ChartIcon = Icon.ChartBar;
const UserIcon = Icon.User;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) =>
            HomeIcon ? <HomeIcon color={color} size={size} /> : null,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color, size }) =>
            TicketIcon ? <TicketIcon color={color} size={size} /> : null,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) =>
            ChartIcon ? <ChartIcon color={color} size={size} /> : null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) =>
            UserIcon ? <UserIcon color={color} size={size} /> : null,
        }}
      />
      {/* Scan is hidden from tabs — accessed from Home Quick Actions */}
      <Tabs.Screen
        name="scan"
        options={{
          href: null,
        }}
      />
      {/* Pending is hidden from tabs */}
      <Tabs.Screen
        name="pending"
        options={{
          href: null,
        }}
      />
      {/* Login is hidden from tabs */}
      <Tabs.Screen
        name="login"
        options={{
          href: null,
        }}
      />
      {/* Payment screens hidden from tabs */}
      <Tabs.Screen
        name="offline-pay"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="upi-pay"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
