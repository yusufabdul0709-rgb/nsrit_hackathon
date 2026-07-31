import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { useRouter } from 'expo-router';

const BellIcon = Icon.Bell;
const MapPinIcon = Icon.MapPin;
const TicketIcon = Icon.Ticket;
const ScanIcon = Icon.Scan || Icon.Maximize;
const SignalIcon = Icon.Signal || Icon.Wifi;
const UsersIcon = Icon.Users;
const IndianRupeeIcon = Icon.IndianRupee;
const ClockIcon = Icon.Clock;
const RefreshCwIcon = Icon.RefreshCw || Icon.RefreshCcw || Icon.RotateCw;
const AlertCircleIcon = Icon.AlertCircle || Icon.CircleAlert || Icon.AlertTriangle;
const HistoryIcon = Icon.History;
const BusIcon = Icon.Bus || Icon.Truck;

export default function HomeDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.conductorName}>Ramesh Kumar 👋</Text>
            <View style={styles.dutyStatusContainer}>
              <View style={styles.onlineDot} />
              <Text style={styles.dutyStatusText}>Duty Status: Online</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              {BellIcon && <BellIcon color={Colors.text.primary} size={24} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileAvatar} onPress={() => router.push('/profile')}>
              <Text style={styles.avatarText}>RK</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Card */}
        <Card padding={0} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.busNumber}>AP 28 Z 1234</Text>
              <Text style={styles.routeText}>Service 442 • Trip 2</Text>
            </View>
            {BusIcon && <BusIcon color="#FFF" size={32} />}
          </View>
          
          <View style={styles.heroBody}>
            <View style={styles.routeInfo}>
              <View style={styles.stopInfo}>
                <Text style={styles.stopLabel}>Current Stop</Text>
                <Text style={styles.stopName}>Vizag Complex</Text>
              </View>
              <View style={styles.stopDivider} />
              <View style={styles.stopInfo}>
                <Text style={styles.stopLabel}>Next Stop (12 min)</Text>
                <Text style={styles.stopName}>MVP Colony</Text>
              </View>
            </View>

            <View style={styles.heroStats}>
              <View style={styles.statItem}>
                {UsersIcon && <UsersIcon color={Colors.primary} size={20} />}
                <Text style={styles.statValue}>42</Text>
                <Text style={styles.statLabel}>Onboard</Text>
              </View>
              <View style={styles.statItem}>
                {IndianRupeeIcon && <IndianRupeeIcon color={Colors.status.success} size={20} />}
                <Text style={styles.statValue}>₹4.2k</Text>
                <Text style={styles.statLabel}>Collection</Text>
              </View>
              <View style={styles.statItem}>
                {ClockIcon && <ClockIcon color={Colors.status.warning} size={20} />}
                <Text style={styles.statValue}>04:20</Text>
                <Text style={styles.statLabel}>Duty Time</Text>
              </View>
            </View>
            
            <View style={styles.heroActions}>
              <Button 
                title="Issue Ticket" 
                icon={TicketIcon && <TicketIcon color="#FFF" size={20} />} 
                style={{ flex: 1 }}
                onPress={() => router.push('/tickets')}
              />
            </View>
          </View>
        </Card>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction icon={TicketIcon && <TicketIcon color={Colors.primary} />} label="Issue Ticket" onPress={() => router.push('/tickets')} />
          <QuickAction icon={ScanIcon && <ScanIcon color={Colors.primary} />} label="Scan QR" onPress={() => router.push('/scan')} />
          <QuickAction icon={SignalIcon && <SignalIcon color={Colors.primary} />} label="Offline Ticket" onPress={() => {}} />
          <QuickAction icon={UsersIcon && <UsersIcon color={Colors.primary} />} label="Passenger Count" onPress={() => {}} />
          <QuickAction icon={IndianRupeeIcon && <IndianRupeeIcon color={Colors.primary} />} label="Cash Collect" onPress={() => {}} />
          <QuickAction icon={IndianRupeeIcon && <IndianRupeeIcon color={Colors.primary} />} label="UPI Collect" onPress={() => {}} />
          <QuickAction icon={RefreshCwIcon && <RefreshCwIcon color={Colors.primary} />} label="Sync Now" onPress={() => {}} badge="3" />
          <QuickAction icon={AlertCircleIcon && <AlertCircleIcon color={Colors.status.danger} />} label="Emergency" onPress={() => {}} />
        </View>

        {/* Live Route Timeline */}
        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Live Route</Text>
        <Card style={styles.liveRouteCard}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStopActive}>Vizag Complex</Text>
              <Text style={styles.timelineTime}>Current</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotUpcoming]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStopUpcoming}>MVP Colony</Text>
              <Text style={styles.timelineTime}>ETA 10:45 AM (12 min)</Text>
            </View>
          </View>
          <View style={styles.timelineLine} />
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotUpcoming]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineStopUpcoming}>Madhurawada</Text>
              <Text style={styles.timelineTime}>ETA 11:15 AM</Text>
            </View>
          </View>
        </Card>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ icon, label, onPress, badge }: any) {
  return (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress} activeOpacity={0.7}>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <View style={styles.quickActionIcon}>{icon}</View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  conductorName: {
    ...Typography.heading,
    color: Colors.text.primary,
    marginTop: 4,
  },
  dutyStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#E7F9F0',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.success,
    marginRight: 6,
  },
  dutyStatusText: {
    ...Typography.caption,
    color: Colors.status.success,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 8,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarText: {
    ...Typography.body,
    color: '#FFF',
    fontWeight: 'bold',
  },
  heroCard: {
    marginBottom: 32,
    overflow: 'hidden',
  },
  heroHeader: {
    backgroundColor: Colors.primary,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  busNumber: {
    ...Typography.section,
    color: '#FFF',
  },
  routeText: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  heroBody: {
    padding: 24,
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  stopInfo: {
    flex: 1,
  },
  stopLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  stopName: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
  },
  stopDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 16,
  },
  sectionTitle: {
    ...Typography.section,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  quickActionCard: {
    width: '21.5%', // roughly 4 in a row, using flex wouldn't wrap properly with precise gaps easily without a list, but this is fine for static grid
    minWidth: 75,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F4FF', // Light blue tint
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    ...Typography.caption,
    fontSize: 12,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.status.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveRouteCard: {
    paddingVertical: 32,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
    marginRight: 16,
  },
  timelineDotActive: {
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: '#D9E6FF',
  },
  timelineDotUpcoming: {
    backgroundColor: Colors.border,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: Colors.border,
    marginLeft: 7, // half of 16 - 1
    marginVertical: -8,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineStopActive: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
  },
  timelineStopUpcoming: {
    ...Typography.cardTitle,
    color: Colors.text.secondary,
  },
  timelineTime: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 4,
  }
});
