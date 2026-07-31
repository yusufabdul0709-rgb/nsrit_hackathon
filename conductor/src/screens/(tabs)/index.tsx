import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const MenuIcon = Icon.Menu;
const BellIcon = Icon.Bell;
const TicketIcon = Icon.Ticket;
const ScanIcon = Icon.Scan;
const UsersIcon = Icon.Users;
const IndianRupeeIcon = Icon.IndianRupee;
const RefreshCwIcon = Icon.RefreshCw;
const EllipsisIcon = Icon.Ellipsis;
const CloudOffIcon = Icon.CloudOff;
const WifiIcon = Icon.Wifi;
const FileTextIcon = Icon.FileText;
const HeadphonesIcon = Icon.Headphones;
const ChartBarIcon = Icon.ChartBar;
const ArrowRightIcon = Icon.ArrowRight;
const CircleDotIcon = Icon.CircleDot;
const WalletIcon = Icon.Wallet;
const ClockIcon = Icon.Clock;
const BusIcon = Icon.Bus;

// ─── Quick Actions ───
const QUICK_ACTIONS = [
  { id: 'issue', icon: TicketIcon, label: 'Issue Ticket', color: Colors.primary },
  { id: 'passengers', icon: UsersIcon, label: 'Passenger\nList', color: '#0891B2' },
  { id: 'cash', icon: WalletIcon, label: 'Cash\nCollection', color: '#059669' },
  { id: 'sync', icon: RefreshCwIcon, label: 'Sync Now', color: '#D97706', badge: '18' },
  { id: 'more', icon: EllipsisIcon, label: 'More', color: Colors.text.secondary },
];

// ─── Dashboard Stats ───
const STATS = [
  { label: 'Tickets Issued', value: '126', sub: 'Today', icon: TicketIcon, color: Colors.primary },
  { label: 'Cash Collected', value: '₹2,450', sub: 'Today', icon: IndianRupeeIcon, color: '#059669' },
  { label: 'Pending Sync', value: '18', sub: 'Transactions', icon: RefreshCwIcon, color: '#D97706' },
  { label: 'Total Passengers', value: '142', sub: 'Today', icon: UsersIcon, color: '#7C3AED' },
];

// ─── Utility Cards ───
const UTILITY_CARDS = [
  { id: 'offline', icon: CloudOffIcon, title: 'Offline Mode', desc: 'Work without internet connection', status: 'Active', statusColor: Colors.status.success },
  { id: 'counter', icon: UsersIcon, title: 'Passenger Counter', desc: 'Total passengers on board', status: '32', statusColor: Colors.primary },
  { id: 'fare', icon: IndianRupeeIcon, title: 'Fare Table', desc: 'View all routes and fares', arrow: true },
  { id: 'journal', icon: FileTextIcon, title: 'Journey Log', desc: "View today's activity and logs", arrow: true },
  { id: 'reports', icon: ChartBarIcon, title: 'Reports', desc: 'View daily collection and summary', arrow: true },
  { id: 'help', icon: HeadphonesIcon, title: 'Help & Support', desc: 'Get help and contact support', arrow: true },
];

export default function HomeDashboard({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  let router: any = null;
  try {
    router = useRouter();
  } catch (e) {}

  const handleQuickAction = (id: string) => {
    if (id === 'issue') {
      if (onNavigate) onNavigate('tickets');
      else if (router?.push) router.push('/tickets');
    } else if (id === 'reports') {
      if (onNavigate) onNavigate('reports');
      else if (router?.push) router.push('/reports');
    }
  };

  const navigateToPending = () => {
    if (onNavigate) onNavigate('pending');
    else if (router?.push) router.push('/pending');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ──── App Header ──── */}
        <View style={styles.appHeader}>
          <View style={styles.headerBrand}>
            <View style={styles.apsrtcBadge}>
              <Text style={styles.apsrtcBadgeText}>AP</Text>
            </View>
            <View>
              <Text style={styles.appTitle}>APSRTC</Text>
              <Text style={styles.appSubtitle}>Conductor App</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellBtn}>
              {BellIcon && <BellIcon color={Colors.text.primary} size={22} />}
              <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>3</Text></View>
            </TouchableOpacity>
            <StatusChip label="Online" status="success" />
          </View>
        </View>

        {/* ──── Greeting Banner ──── */}
        <View style={styles.greetingBanner}>
          <View style={styles.greetingGradient}>
            <View style={styles.greetingContent}>
              <Text style={styles.greetingText}>Good Morning,</Text>
              <Text style={styles.conductorName}>Ramesh Kumar</Text>
              <View style={styles.greetingMeta}>
                <View style={styles.idChip}>
                  <Text style={styles.idChipText}>Conductor ID: 24568</Text>
                </View>
                <View style={styles.idChip}>
                  <Text style={styles.idChipText}>KK01/9</Text>
                </View>
              </View>
              <View style={styles.dutyRow}>
                <View style={styles.dutyDot} />
                <Text style={styles.dutyText}>You are on duty</Text>
              </View>
              <Text style={styles.dutySince}>Since 07:30 AM</Text>
            </View>
            {/* Bus illustration placeholder */}
            <View style={styles.busIllustration}>
              {BusIcon && <BusIcon color="rgba(255,255,255,0.25)" size={80} />}
            </View>
          </View>
        </View>

        {/* ──── Service Info Row ──── */}
        <Card style={styles.serviceCard} padding={16}>
          <View style={styles.serviceRow}>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceLabel}>Service No.</Text>
              <Text style={styles.serviceValue}>KK01/9</Text>
            </View>
            <View style={styles.serviceDivider} />
            <View style={[styles.serviceItem, { flex: 1.5 }]}>
              <Text style={styles.serviceLabel}>Route</Text>
              <View style={styles.routeRow}>
                <Text style={styles.serviceValue}>Vizianagaram</Text>
                {ArrowRightIcon && <ArrowRightIcon color={Colors.text.secondary} size={14} />}
                <Text style={styles.serviceValue}>MVP Colony</Text>
              </View>
            </View>
            <View style={styles.serviceDivider} />
            <View style={styles.serviceItem}>
              <Text style={styles.serviceLabel}>Bus No.</Text>
              <Text style={[styles.serviceValue, { color: Colors.primary }]}>AP39Z 1234</Text>
            </View>
          </View>
        </Card>

        {/* ──── Quick Actions ──── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsScroll}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              activeOpacity={0.7}
              onPress={() => handleQuickAction(action.id)}
            >
              {action.badge && (
                <View style={styles.qaBadge}>
                  <Text style={styles.qaBadgeText}>{action.badge}</Text>
                </View>
              )}
              <View style={[styles.qaIconCircle, { backgroundColor: action.color + '14' }]}>
                {action.icon && <action.icon color={action.color} size={22} />}
              </View>
              <Text style={styles.qaLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ──── Dashboard Statistics ──── */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <Card key={i} style={styles.statCard} padding={16}>
              <View style={[styles.statIconCircle, { backgroundColor: stat.color + '14' }]}>
                {stat.icon && <stat.icon color={stat.color} size={18} />}
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statSub}>{stat.sub}</Text>
            </Card>
          ))}
        </View>

        {/* ──── Pending Transactions ──── */}
        <Card style={styles.pendingCard} padding={20}>
          <View style={styles.pendingHeader}>
            <View style={[styles.pendingIconCircle]}>
              {RefreshCwIcon && <RefreshCwIcon color={Colors.status.warning} size={22} />}
            </View>
            <View style={styles.pendingInfo}>
              <Text style={styles.pendingTitle}>Pending Transactions</Text>
              <Text style={styles.pendingDesc}>18 transactions pending to sync</Text>
              <Text style={styles.pendingTime}>Last sync: Today, 07:30 AM</Text>
            </View>
          </View>
          <Button
            title="View Offline Payments"
            icon={ArrowRightIcon && <ArrowRightIcon color="#FFF" size={18} />}
            style={styles.syncButton}
            onPress={navigateToPending}
          />
        </Card>

        {/* ──── Utility Cards Grid ──── */}
        <View style={styles.utilityGrid}>
          {UTILITY_CARDS.map((card) => (
            <TouchableOpacity key={card.id} style={styles.utilityCard} activeOpacity={0.7}>
              <View style={[styles.utilityIconCircle, { backgroundColor: Colors.primaryLight }]}>
                {card.icon && <card.icon color={Colors.primary} size={20} />}
              </View>
              <Text style={styles.utilityTitle}>{card.title}</Text>
              <Text style={styles.utilityDesc}>{card.desc}</Text>
              {card.status && (
                <Text style={[styles.utilityStatus, { color: card.statusColor }]}>{card.status}</Text>
              )}
              {card.arrow && (
                <View style={styles.utilityArrow}>
                  {ArrowRightIcon && <ArrowRightIcon color={Colors.primary} size={16} />}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 16,
  },

  // ──── App Header ────
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBrand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 10,
  },
  apsrtcBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apsrtcBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  appTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginTop: -1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.status.danger,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notifBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  // ──── Greeting Banner ────
  greetingBanner: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
  },
  greetingGradient: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    minHeight: 180,
    position: 'relative',
    overflow: 'hidden',
  },
  greetingContent: {
    flex: 1,
    zIndex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  conductorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 12,
  },
  greetingMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  idChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  dutyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dutyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  dutyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  dutySince: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginLeft: 14,
  },
  busIllustration: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    opacity: 0.4,
  },

  // ──── Service Info ────
  serviceCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceItem: {
    flex: 1,
  },
  serviceLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  serviceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  serviceDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },

  // ──── Section Title ────
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    ...Typography.section,
    color: Colors.text.primary,
  },

  // ──── Quick Actions ────
  quickActionsScroll: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 4,
    marginBottom: 20,
  },
  quickActionCard: {
    width: 80,
    alignItems: 'center',
    position: 'relative',
  },
  qaIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: Colors.primaryLight,
  },
  qaLabel: {
    ...Typography.quickActionLabel,
    color: Colors.text.primary,
    textAlign: 'center',
    lineHeight: 14,
  },
  qaBadge: {
    position: 'absolute',
    top: -4,
    right: 4,
    backgroundColor: Colors.status.danger,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    zIndex: 2,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  qaBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // ──── Dashboard Stats ────
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 52) / 2,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    ...Typography.statLabel,
    color: Colors.text.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  statSub: {
    ...Typography.caption,
    color: Colors.text.light,
  },

  // ──── Pending Transactions ────
  pendingCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 14,
  },
  pendingIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.status.warningBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingInfo: {
    flex: 1,
  },
  pendingTitle: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  pendingDesc: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  pendingTime: {
    ...Typography.caption,
    color: Colors.text.light,
  },
  syncButton: {
    backgroundColor: Colors.primary,
  },

  // ──── Utility Cards ────
  utilityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  utilityCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  utilityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  utilityTitle: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
    fontSize: 14,
    marginBottom: 4,
  },
  utilityDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  utilityStatus: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  utilityArrow: {
    alignSelf: 'flex-start',
  },
});
