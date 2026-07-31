import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Card } from '../../components/Card';
import { StatusChip } from '../../components/StatusChip';
import { Button } from '../../components/Button';


const UserIcon = Icon.User;
const ShieldIcon = Icon.Shield;
const SettingsIcon = Icon.Settings;
const HelpCircleIcon = Icon.HelpCircle;
const LogOutIcon = Icon.LogOut;
const ChevronRightIcon = Icon.ChevronRight;
const AlertTriangleIcon = Icon.AlertTriangle;
const BellIcon = Icon.Bell;
const CloudOffIcon = Icon.CloudOff;
const LockIcon = Icon.Lock;
const BusIcon = Icon.Bus;
const TicketIcon = Icon.Ticket;
const SmartphoneIcon = Icon.Smartphone;

export default function ProfileScreen({ onLogout }: { onLogout?: () => void }) {

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    if (router?.replace) {
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card */}
        <Card style={styles.profileCard} padding={24}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RK</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>Ramesh Kumar</Text>
              <Text style={styles.profileId}>Conductor ID: 24568</Text>
              <StatusChip label="On Duty" status="success" />
            </View>
          </View>
        </Card>

        {/* Duty Information */}
        <Text style={styles.sectionTitle}>Duty Information</Text>
        <Card padding={0} style={styles.listCard}>
          <View style={[styles.dutyRow, styles.dutyRowBorder]}>
            <Text style={styles.dutyLabel}>Assigned Service</Text>
            <Text style={styles.dutyValue}>KK01/9</Text>
          </View>
          <View style={[styles.dutyRow, styles.dutyRowBorder]}>
            <Text style={styles.dutyLabel}>Assigned Bus</Text>
            <Text style={styles.dutyValue}>AP39Z 1234</Text>
          </View>
          <View style={[styles.dutyRow, styles.dutyRowBorder]}>
            <Text style={styles.dutyLabel}>Route</Text>
            <Text style={styles.dutyValue}>Vizianagaram → MVP Colony</Text>
          </View>
          <View style={styles.dutyRow}>
            <Text style={styles.dutyLabel}>Duty Status</Text>
            <StatusChip label="Active" status="success" />
          </View>
        </Card>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <Card padding={0} style={styles.listCard}>
          <ListItem icon={SettingsIcon && <SettingsIcon color={Colors.primary} size={20} />} title="App Settings" />
          <ListItem icon={BellIcon && <BellIcon color={Colors.primary} size={20} />} title="Notification Settings" />
          <ListItem icon={CloudOffIcon && <CloudOffIcon color={Colors.status.warning} size={20} />} title="Offline Settings" />
          <ListItem icon={LockIcon && <LockIcon color={Colors.primary} size={20} />} title="Security" borderBottom={false} />
        </Card>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <Card padding={0} style={styles.listCard}>
          <ListItem icon={HelpCircleIcon && <HelpCircleIcon color={Colors.primary} size={20} />} title="Help & Support" />
          <ListItem icon={AlertTriangleIcon && <AlertTriangleIcon color={Colors.status.warning} size={20} />} title="Report an Issue" borderBottom={false} />
        </Card>

        {/* Logout */}
        <View style={styles.footerActions}>
          <Button 
            title="Logout" 
            variant="outline"
            icon={LogOutIcon && <LogOutIcon color={Colors.primary} size={20} />}
            onPress={handleLogout}
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>APSRTC Conductor App v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2026 APSRTC. All rights reserved.</Text>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

function ListItem({ icon, title, borderBottom = true }: any) {
  return (
    <TouchableOpacity style={[styles.listItem, borderBottom && styles.listItemBorder]} activeOpacity={0.7}>
      <View style={styles.listIconContainer}>{icon}</View>
      <Text style={styles.listTitle}>{title}</Text>
      {ChevronRightIcon && <ChevronRightIcon color={Colors.text.light} size={18} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.text.primary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Profile Card
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    ...Typography.section,
    color: Colors.text.primary,
  },
  profileId: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 4,
  },

  // Section
  sectionTitle: {
    ...Typography.section,
    color: Colors.text.primary,
    marginBottom: 12,
    marginTop: 4,
    fontSize: 16,
  },

  // Duty Info
  listCard: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  dutyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  dutyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dutyLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  dutyValue: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text.primary,
  },

  // List Items
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.card,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  listIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  listTitle: {
    flex: 1,
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '500',
    fontSize: 15,
  },

  // Footer
  footerActions: {
    marginTop: 12,
    marginBottom: 24,
  },

  // App Info
  appInfo: {
    alignItems: 'center',
    gap: 4,
  },
  appInfoText: {
    ...Typography.caption,
    color: Colors.text.light,
  },
});
