import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, StatusBar, Platform, TextInput } from 'react-native';
import {
  Bell, MapPin, Wallet, Search, ArrowRightLeft,
  Ticket, Bus, QrCode, Clock, Map as MapIcon,
  Gift, Compass, Navigation, History, Shield, Settings,
  ChevronRight, ArrowRight, Star
} from 'lucide-react-native';

import ScanQR from './ScanQR';

const COLORS = {
  primary: '#004CFF',
  secondary: '#3F74F9',
  background: '#F6F8FC',
  surface: '#FFFFFF',
  cardBorder: '#E8EEF9',
  primaryText: '#0F172A',
  secondaryText: '#64748B',
  divider: '#E5E7EB',
  success: '#16C47F',
  warning: '#FFB020',
  error: '#F04438',
};

const Header = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/150?u=jay' }}
        style={styles.avatar}
      />
      <View style={styles.headerText}>
        <Text style={[styles.greetingText, { color: 'rgba(255,255,255,0.8)' }]}>Good Morning,</Text>
        <Text style={[styles.nameText, { color: COLORS.surface }]}>Jayadevan 👋</Text>
      </View>
    </View>

    <View style={styles.headerRight}>
      <View style={[styles.locationBadge, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'transparent' }]}>
        <MapPin color={COLORS.surface} size={14} />
        <Text style={[styles.locationText, { color: COLORS.surface }]}>Delhi</Text>
      </View>
      <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'transparent' }]}>
        <Wallet color={COLORS.surface} size={22} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.iconBtn, { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'transparent' }]}>
        <Bell color={COLORS.surface} size={22} />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  </View>
);

const HeroCard = () => (
  <View style={styles.heroCard}>
    <View style={styles.heroTopRow}>
      <View style={styles.heroContent}>
        <Text style={styles.heroHeadline}>Travel Smarter.</Text>
        <Text style={styles.heroHeadline}>Ride Better.</Text>
        <Text style={[styles.heroHeadline, { color: 'rgba(255,255,255,0.7)' }]}>Anywhere.</Text>
      </View>
      <View style={styles.heroImageContainer}>
        <Image
          source={require('./assets/logo_banner.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>
    </View>

    <View style={styles.heroActions}>
      <TouchableOpacity style={styles.heroActionBtn}>
        <Ticket color={COLORS.primary} size={20} />
        <Text style={styles.heroActionText}>Buy Ticket</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.heroActionBtn}>
        <Navigation color={COLORS.primary} size={20} />
        <Text style={styles.heroActionText}>Live Tracking</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const SmartSearch = () => (
  <View style={styles.searchCard}>
    <View style={styles.searchInputs}>
      <View style={styles.inputRow}>
        <View style={styles.dotFrom} />
        <TextInput
          style={styles.input}
          placeholder="From"
          placeholderTextColor={COLORS.secondaryText}
          value="Current Location"
        />
      </View>
      <View style={styles.inputDivider} />
      <View style={styles.inputRow}>
        <View style={styles.dotTo} />
        <TextInput
          style={styles.input}
          placeholder="Where to?"
          placeholderTextColor={COLORS.secondaryText}
        />
      </View>
      <TouchableOpacity style={styles.swapBtn}>
        <ArrowRightLeft color={COLORS.primary} size={18} />
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.searchBtn}>
      <Search color={COLORS.surface} size={20} />
      <Text style={styles.searchBtnText}>Search Buses</Text>
    </TouchableOpacity>

    <View style={styles.recentPlaces}>
      <TouchableOpacity style={styles.recentChip}>
        <MapIcon color={COLORS.secondaryText} size={14} />
        <Text style={styles.recentText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.recentChip}>
        <MapIcon color={COLORS.secondaryText} size={14} />
        <Text style={styles.recentText}>Office</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.recentChip}>
        <MapIcon color={COLORS.secondaryText} size={14} />
        <Text style={styles.recentText}>Airport</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const QuickActions = () => {
  const actions = [
    { icon: Ticket, label: 'Buy Ticket' },
    { icon: Navigation, label: 'Live Tracking' },
    { icon: Gift, label: 'Bus Pass' },
    { icon: QrCode, label: 'Scan QR' },
    { icon: MapPin, label: 'Nearby Stops' },
    { icon: Compass, label: 'Planner' },
    { icon: Wallet, label: 'Wallet' },
    { icon: History, label: 'History' },
    { icon: Star, label: 'Rewards' },
    { icon: Shield, label: 'Support' },
  ];

  return (
    <View style={styles.quickActionsContainer}>
      {actions.map((action, index) => (
        <TouchableOpacity key={index} style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <action.icon color={COLORS.primary} size={24} strokeWidth={1.5} />
          </View>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const LiveTracking = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View>
        <Text style={styles.cardTitle}>Live Bus Tracking</Text>
        <Text style={styles.cardSubtitle}>Route 42A • Arriving in 4 min</Text>
      </View>
      <View style={styles.occupancyBadge}>
        <Text style={styles.occupancyText}>Medium</Text>
      </View>
    </View>

    <View style={styles.liveMapPlaceholder}>
      {/* Abstract map elements */}
      <View style={styles.routeLine} />
      <View style={[styles.routeDot, { left: '10%' }]} />
      <View style={[styles.routeDot, { left: '50%' }]} />
      <View style={[styles.routeDot, { left: '90%' }]} />

      {/* Animated Bus Indicator */}
      <View style={styles.busIndicator}>
        <Bus color={COLORS.surface} size={16} />
      </View>
    </View>

    <View style={styles.liveFooter}>
      <View>
        <Text style={styles.stopLabel}>Next Stop</Text>
        <Text style={styles.stopName}>Connaught Place</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.stopLabel}>Distance</Text>
        <Text style={styles.stopName}>1.2 km</Text>
      </View>
    </View>
  </View>
);

const RecentJourneys = () => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Recent Journeys</Text>
      <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
    </View>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
      <View style={styles.journeyCard}>
        <View style={styles.journeyTop}>
          <View>
            <Text style={styles.journeyDest}>Connaught Place</Text>
            <Text style={styles.journeyDate}>Today, 09:30 AM</Text>
          </View>
          <Text style={styles.journeyFare}>₹25</Text>
        </View>
        <TouchableOpacity style={styles.rebookBtn}>
          <Text style={styles.rebookText}>Rebook Ticket</Text>
          <ArrowRight color={COLORS.primary} size={16} />
        </TouchableOpacity>
      </View>

      <View style={styles.journeyCard}>
        <View style={styles.journeyTop}>
          <View>
            <Text style={styles.journeyDest}>Cyber City</Text>
            <Text style={styles.journeyDate}>Yesterday, 06:15 PM</Text>
          </View>
          <Text style={styles.journeyFare}>₹40</Text>
        </View>
        <TouchableOpacity style={styles.rebookBtn}>
          <Text style={styles.rebookText}>Rebook Ticket</Text>
          <ArrowRight color={COLORS.primary} size={16} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
);

const BottomNav = ({ onScanPress }) => (
  <View style={styles.bottomNavContainer}>
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}>
        <Compass color={COLORS.primary} size={24} />
        <Text style={[styles.navLabel, { color: COLORS.primary }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ticket color={COLORS.secondaryText} size={24} />
        <Text style={styles.navLabel}>Journey</Text>
      </TouchableOpacity>

      <View style={styles.navScanSpacer} />

      <TouchableOpacity style={styles.navItem}>
        <Wallet color={COLORS.secondaryText} size={24} />
        <Text style={styles.navLabel}>Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Settings color={COLORS.secondaryText} size={24} />
        <Text style={styles.navLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.scanFab} onPress={onScanPress}>
      <QrCode color={COLORS.surface} size={32} />
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  if (currentScreen === 'scan') {
    return <ScanQR onBack={() => setCurrentScreen('home')} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.topBlueSection}>
            <Header />
            <HeroCard />
          </View>
          <View style={styles.bottomContent}>
            <SmartSearch />
            <QuickActions />
            <LiveTracking />
            <RecentJourneys />
            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </View>
      <BottomNav onScanPress={() => setCurrentScreen('scan')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  topBlueSection: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  bottomContent: {
    paddingHorizontal: 20,
    marginTop: -32,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerText: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontWeight: '500',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryText,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondaryText,
    marginLeft: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    backgroundColor: COLORS.error,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },

  // Hero Card
  heroCard: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 1,
  },
  heroContent: {
    flex: 1,
  },
  heroImageContainer: {
    width: 140,
    height: 110,
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroHeadline: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.surface,
    lineHeight: 36,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    zIndex: 1,
  },
  heroActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
  },
  heroActionText: {
    color: COLORS.primaryText,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },

  // Smart Search
  searchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchInputs: {
    position: 'relative',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  dotFrom: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.secondary,
    marginRight: 12,
  },
  dotTo: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primaryText,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primaryText,
  },
  inputDivider: {
    height: 1,
    backgroundColor: COLORS.surface,
    marginVertical: 4,
  },
  swapBtn: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 16,
    marginBottom: 16,
  },
  searchBtnText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recentPlaces: {
    flexDirection: 'row',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  recentText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.secondaryText,
    marginLeft: 6,
  },

  // Quick Actions Grid
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionItem: {
    width: '18%', // Fits 5 in a row comfortably
    alignItems: 'center',
    marginBottom: 20,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryText,
    textAlign: 'center',
  },

  // Generic Card & Sections
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryText,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // Live Tracking
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryText,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  occupancyBadge: {
    backgroundColor: COLORS.warning + '1A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  occupancyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warning,
  },
  liveMapPlaceholder: {
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  routeLine: {
    height: 4,
    backgroundColor: COLORS.primary + '33',
    borderRadius: 2,
    width: '100%',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 3,
    borderColor: COLORS.primary,
    position: 'absolute',
    top: '50%',
    marginTop: -6,
  },
  busIndicator: {
    position: 'absolute',
    left: '40%',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  liveFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stopLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 4,
    fontWeight: '500',
  },
  stopName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryText,
  },

  // Recent Journeys
  journeyCard: {
    width: 260,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  journeyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  journeyDest: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryText,
    marginBottom: 4,
  },
  journeyDate: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  journeyFare: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  rebookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    borderRadius: 12,
  },
  rebookText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 6,
  },

  // Bottom Nav
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    justifyContent: 'space-between',
    width: '100%',
  },
  navItem: {
    alignItems: 'center',
    width: 56,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondaryText,
    marginTop: 6,
  },
  navScanSpacer: {
    width: 64,
  },
  scanFab: {
    position: 'absolute',
    top: -28,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderWidth: 4,
    borderColor: COLORS.background,
  }
});
