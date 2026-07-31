import { Tabs } from 'expo-router';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { View, StyleSheet, Platform } from 'react-native';

const HomeIcon = Icon.Home;
const TicketIcon = Icon.Ticket;
const ScanIcon = Icon.Scan || Icon.Maximize;
const FileTextIcon = Icon.FileText || Icon.File;
const UserIcon = Icon.User;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (HomeIcon ? <HomeIcon color={color} size={size} /> : null),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color, size }) => (TicketIcon ? <TicketIcon color={color} size={size} /> : null),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.scanButton}>
              {ScanIcon && <ScanIcon color="#FFFFFF" size={28} />}
            </View>
          ),
          tabBarLabel: 'Scan',
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (FileTextIcon ? <FileTextIcon color={color} size={size} /> : null),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (UserIcon ? <UserIcon color={color} size={size} /> : null),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 10,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 10 : 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }
});
