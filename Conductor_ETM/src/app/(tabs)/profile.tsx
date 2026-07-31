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
const AlertTriangleIcon = Icon.AlertTriangle || Icon.TriangleAlert;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Info Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>RK</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>Ramesh Kumar</Text>
              <Text style={styles.profileId}>ID: APSRTC-4829</Text>
              <View style={styles.statusRow}>
                <StatusChip label="Online" status="success" />
              </View>
            </View>
          </View>
        </Card>

        {/* Action List */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Card padding={0} style={styles.listCard}>
          <ListItem icon={UserIcon && <UserIcon color={Colors.text.primary} />} title="Personal Details" />
          <ListItem icon={ShieldIcon && <ShieldIcon color={Colors.text.primary} />} title="Duty History" />
          <ListItem icon={SettingsIcon && <SettingsIcon color={Colors.text.primary} />} title="App Settings" borderBottom={false} />
        </Card>

        <Text style={styles.sectionTitle}>Support</Text>
        <Card padding={0} style={styles.listCard}>
          <ListItem icon={HelpCircleIcon && <HelpCircleIcon color={Colors.text.primary} />} title="Help & Support" />
          <ListItem icon={AlertTriangleIcon && <AlertTriangleIcon color={Colors.status.warning} />} title="Report an Issue" borderBottom={false} />
        </Card>

        <View style={styles.footerActions}>
          <Button 
            title="Emergency SOS" 
            icon={AlertTriangleIcon && <AlertTriangleIcon color="#FFF" size={20} />} 
            style={{ backgroundColor: Colors.status.danger, marginBottom: 16 }} 
          />
          <Button 
            title="Logout" 
            variant="outline"
            icon={LogOutIcon && <LogOutIcon color={Colors.primary} size={20} />} 
          />
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
      {ChevronRightIcon && <ChevronRightIcon color={Colors.text.secondary} size={20} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingBottom: 16 },
  headerTitle: { ...Typography.heading, color: Colors.text.primary },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  profileCard: { marginBottom: 32 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 20, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  profileDetails: { flex: 1 },
  profileName: { ...Typography.section, color: Colors.text.primary, marginBottom: 4 },
  profileId: { ...Typography.body, color: Colors.text.secondary, marginBottom: 8 },
  statusRow: { flexDirection: 'row' },
  sectionTitle: { ...Typography.section, color: Colors.text.primary, marginBottom: 16 },
  listCard: { marginBottom: 24, overflow: 'hidden' },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: Colors.card },
  listItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  listIconContainer: { marginRight: 16 },
  listTitle: { flex: 1, ...Typography.body, color: Colors.text.primary, fontWeight: '500' },
  footerActions: { marginTop: 24 }
});
