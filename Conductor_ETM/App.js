import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Platform 
} from 'react-native';
import { 
  Wifi, 
  Users, 
  Ticket, 
  QrCode, 
  MapPin, 
  CreditCard,
  History,
  CheckCircle2,
  Wallet
} from 'lucide-react-native';
import ScanPassenger from './ScanPassenger';

const COLORS = {
  primary: '#004CFF',
  secondary: '#3F74F9',
  background: '#F6F8FC',
  surface: '#FFFFFF',
  cardBorder: '#E8EEF9',
  primaryText: '#0F172A',
  secondaryText: '#64748B',
  success: '#16C47F',
  warning: '#FFB020',
};

const Header = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>RA</Text>
      </View>
      <View style={styles.headerText}>
        <Text style={styles.greetingText}>Conductor</Text>
        <Text style={styles.nameText}>Raju A. (ID: 4092)</Text>
      </View>
    </View>
    
    <View style={styles.headerRight}>
      <View style={styles.statusBadge}>
        <Wifi color={COLORS.success} size={14} />
        <Text style={styles.statusText}>Online</Text>
      </View>
    </View>
  </View>
);

const OccupancyCard = () => (
  <View style={styles.occupancyCard}>
    <View style={styles.occupancyTop}>
      <View>
        <Text style={styles.routeLabel}>ACTIVE ROUTE</Text>
        <Text style={styles.routeText}>214 - Cyber City Express</Text>
      </View>
      <View style={styles.iconCircle}>
        <MapPin color={COLORS.primary} size={20} />
      </View>
    </View>

    <View style={styles.occupancyDetails}>
      <View style={styles.occupancyStat}>
        <Users color={COLORS.secondaryText} size={20} />
        <View style={styles.statTexts}>
          <Text style={styles.statValue}>42<Text style={styles.statTotal}>/60</Text></Text>
          <Text style={styles.statLabel}>Current Passengers</Text>
        </View>
      </View>
      <View style={styles.occupancyStat}>
        <Wallet color={COLORS.secondaryText} size={20} />
        <View style={styles.statTexts}>
          <Text style={styles.statValue}>₹1,840</Text>
          <Text style={styles.statLabel}>Collected</Text>
        </View>
      </View>
    </View>
  </View>
);

const TicketGrid = () => {
  const tickets = [
    { label: 'Adult Standard', price: '₹40', icon: Ticket, color: COLORS.primary },
    { label: 'Child/Senior', price: '₹20', icon: Users, color: COLORS.secondary },
    { label: 'Express Pass', price: '₹60', icon: CreditCard, color: COLORS.warning },
    { label: 'History', price: 'Logs', icon: History, color: COLORS.secondaryText },
  ];

  return (
    <View style={styles.gridContainer}>
      <Text style={styles.sectionTitle}>Quick Issue</Text>
      <View style={styles.grid}>
        {tickets.map((t, idx) => (
          <TouchableOpacity key={idx} style={styles.gridItem}>
            <View style={[styles.gridIcon, { backgroundColor: t.color + '15' }]}>
              <t.icon color={t.color} size={24} />
            </View>
            <Text style={styles.gridLabel}>{t.label}</Text>
            <Text style={styles.gridPrice}>{t.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  if (currentScreen === 'scan') {
    return <ScanPassenger onBack={() => setCurrentScreen('home')} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.topBlueSection}>
            <Header />
          </View>
          
          <View style={styles.mainContent}>
            <OccupancyCard />
            <TicketGrid />
            <View style={{ height: 100 }} />
          </View>

        </ScrollView>

        <View style={styles.scanFabContainer}>
          <TouchableOpacity 
            style={styles.scanFab}
            activeOpacity={0.8}
            onPress={() => setCurrentScreen('scan')}
          >
            <QrCode color={COLORS.surface} size={32} />
            <Text style={styles.scanFabText}>Scan Passenger QR</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  mainContent: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 16,
  },
  greetingText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.surface,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.surface,
    marginLeft: 6,
  },

  // Occupancy Card
  occupancyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  occupancyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  routeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryText,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  occupancyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  occupancyStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTexts: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryText,
  },
  statTotal: {
    fontSize: 14,
    color: COLORS.secondaryText,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },

  // Ticket Grid
  gridContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryText,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  gridIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryText,
    marginBottom: 4,
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Scan FAB
  scanFabContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  scanFab: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  scanFabText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
});
