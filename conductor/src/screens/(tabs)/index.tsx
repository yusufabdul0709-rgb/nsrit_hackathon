import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import * as Icon from '../../components/Icons';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useRouter } from 'expo-router';
import { conductorSocket } from '../../services/socketService';
import { apiClient } from '../../services/apiClient';

const { width } = Dimensions.get('window');

const MenuIcon = Icon.Menu;
const BellIcon = Icon.Bell;
const BusIcon = Icon.Bus;
const QrCodeIcon = Icon.QrCode;
const TicketIcon = Icon.Ticket;
const RefreshCwIcon = Icon.RefreshCw;
const FileTextIcon = Icon.FileText;
const CreditCardIcon = Icon.CreditCard;
const IndianRupeeIcon = Icon.IndianRupee;
const UsersIcon = Icon.Users;
const ArrowRightIcon = Icon.ArrowRight;

export default function DashboardScreen() {
  let router: any = null;
  try {
    router = useRouter();
  } catch (e) {}

  // Dynamic Metrics starting from zero (0)
  const [totalCollection, setTotalCollection] = useState(0);
  const [passengerCount, setPassengerCount] = useState(0);
  const [ticketsIssued, setTicketsIssued] = useState(0);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  useEffect(() => {
    conductorSocket.connect();

    conductorSocket.on('ticketGenerated', (ticket: any) => {
      setTicketsIssued((prev) => prev + 1);
      setPassengerCount((prev) => prev + 1);
      if (ticket.paymentStatus === 'SUCCESS') {
        setTotalCollection((prev) => prev + Number(ticket.fare || 0));
      } else {
        setPendingSyncCount((prev) => prev + 1);
      }
    });

    conductorSocket.on('paymentCompleted', (data: any) => {
      if (data.newTotalCollection !== undefined) {
        setTotalCollection(data.newTotalCollection);
      }
    });

    conductorSocket.on('syncCompleted', () => {
      setPendingSyncCount(0);
    });

    fetchActiveTrip();
  }, []);

  const fetchActiveTrip = async () => {
    try {
      const res = await apiClient.get('/trips/active');
      if (res.success && res.trip) {
        setTotalCollection(res.trip.totalCollection || 0);
        setPassengerCount(res.trip.passengerCount || 0);
        setPendingSyncCount(res.trip.pendingSyncCount || 0);
      }
    } catch (e) {}
  };

  const navigateTo = (path: string) => {
    if (router?.push) {
      router.push(path);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* App Header */}
        <View style={styles.appHeader}>
          <TouchableOpacity style={styles.menuBtn}>
            {MenuIcon && <MenuIcon color={Colors.text.primary} size={22} />}
          </TouchableOpacity>
          
          <View style={styles.headerBrand}>
            <View style={styles.apsrtcBadge}>
              <Text style={styles.apsrtcBadgeText}>AP</Text>
            </View>
            <View>
              <Text style={styles.appTitle}>APSRTC ETM</Text>
              <Text style={styles.appSubtitle}>Smart Bus Ticketing System</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellBtn}>
              {BellIcon && <BellIcon color={Colors.text.primary} size={22} />}
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting Banner */}
        <View style={styles.greetingBanner}>
          <View style={styles.greetingGradient}>
            <View style={styles.greetingContent}>
              <Text style={styles.greetingText}>Namaste 🙏</Text>
              <Text style={styles.conductorName}>Venkateswarlu K.</Text>
              
              <View style={styles.greetingMeta}>
                <View style={styles.idChip}>
                  <Text style={styles.idChipText}>ID: 24568</Text>
                </View>
                <View style={styles.idChip}>
                  <Text style={styles.idChipText}>Depot: VSP-1</Text>
                </View>
              </View>

              <View style={styles.dutyRow}>
                <View style={styles.dutyDot} />
                <Text style={styles.dutyText}>On Duty • Shift 1</Text>
              </View>
              <Text style={styles.dutySince}>Started at 06:00 AM</Text>
            </View>

            <View style={styles.busIllustration}>
              {BusIcon && <BusIcon color="#FFFFFF" size={100} />}
            </View>
          </View>
        </View>

        {/* Service Info Card */}
        <Card style={styles.serviceCard}>
          <View style={styles.serviceRow}>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceLabel}>SERVICE NO.</Text>
              <Text style={styles.serviceValue}>400D Express</Text>
            </View>
            <View style={styles.serviceDivider} />
            <View style={styles.serviceItem}>
              <Text style={styles.serviceLabel}>BUS NO.</Text>
              <Text style={styles.serviceValue}>AP 31 TB 4567</Text>
            </View>
            <View style={styles.serviceDivider} />
            <View style={[styles.serviceItem, { flex: 1.2 }]}>
              <Text style={styles.serviceLabel}>ROUTE</Text>
              <Text style={styles.serviceValue} numberOfLines={1}>Vizag → Anakapalle</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions Title */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Quick Operations</Text>
        </View>

        {/* Quick Actions Grid */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsScroll}>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => navigateTo('/scan')}>
            <View style={[styles.qaIconCircle, { backgroundColor: Colors.primaryLight }]}>
              {QrCodeIcon && <QrCodeIcon color={Colors.primary} size={24} />}
            </View>
            <Text style={styles.qaLabel}>Generate QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard} onPress={() => navigateTo('/tickets')}>
            <View style={[styles.qaIconCircle, { backgroundColor: '#E0F2FE' }]}>
              {TicketIcon && <TicketIcon color="#0284C7" size={24} />}
            </View>
            <Text style={styles.qaLabel}>Issue Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard} onPress={() => navigateTo('/upi-pay')}>
            <View style={[styles.qaIconCircle, { backgroundColor: '#DCFCE7' }]}>
              {CreditCardIcon && <CreditCardIcon color="#16A34A" size={24} />}
            </View>
            <Text style={styles.qaLabel}>UPI Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard} onPress={() => navigateTo('/pending')}>
            <View style={[styles.qaIconCircle, { backgroundColor: '#FEF3C7' }]}>
              {RefreshCwIcon && <RefreshCwIcon color="#D97706" size={24} />}
            </View>
            {pendingSyncCount > 0 && (
              <View style={styles.qaBadge}>
                <Text style={styles.qaBadgeText}>{pendingSyncCount}</Text>
              </View>
            )}
            <Text style={styles.qaLabel}>Sync Queue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard} onPress={() => navigateTo('/reports')}>
            <View style={[styles.qaIconCircle, { backgroundColor: '#F3E8FF' }]}>
              {FileTextIcon && <FileTextIcon color="#9333EA" size={24} />}
            </View>
            <Text style={styles.qaLabel}>Waybill</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Dashboard Stats */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Today's Collection Summary</Text>
        </View>

        <View style={styles.statsGrid}>
          {/* Collection Stat */}
          <Card style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#DCFCE7' }]}>
              {IndianRupeeIcon && <IndianRupeeIcon color="#16A34A" size={20} />}
            </View>
            <Text style={styles.statLabel}>Total Collection</Text>
            <Text style={styles.statValue}>₹{totalCollection}</Text>
            <Text style={styles.statSub}>Starting from ₹0</Text>
          </Card>

          {/* Passengers Stat */}
          <Card style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#E0F2FE' }]}>
              {UsersIcon && <UsersIcon color="#0284C7" size={20} />}
            </View>
            <Text style={styles.statLabel}>Passengers</Text>
            <Text style={styles.statValue}>{passengerCount}</Text>
            <Text style={styles.statSub}>Total Passengers</Text>
          </Card>

          {/* Tickets Issued Stat */}
          <Card style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#F3E8FF' }]}>
              {TicketIcon && <TicketIcon color="#9333EA" size={20} />}
            </View>
            <Text style={styles.statLabel}>Tickets Issued</Text>
            <Text style={styles.statValue}>{ticketsIssued}</Text>
            <Text style={styles.statSub}>ETM Receipts</Text>
          </Card>

          {/* Pending Sync Stat */}
          <Card style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
              {RefreshCwIcon && <RefreshCwIcon color="#D97706" size={20} />}
            </View>
            <Text style={styles.statLabel}>Pending Sync</Text>
            <Text style={[styles.statValue, { color: pendingSyncCount > 0 ? Colors.status.warning : Colors.text.primary }]}>
              {pendingSyncCount}
            </Text>
            <Text style={styles.statSub}>Offline Transactions</Text>
          </Card>
        </View>

        {/* Pending Sync Alert Card */}
        {pendingSyncCount > 0 && (
          <Card style={styles.pendingCard}>
            <View style={styles.pendingHeader}>
              <View style={styles.pendingIconCircle}>
                {RefreshCwIcon && <RefreshCwIcon color={Colors.status.warning} size={24} />}
              </View>
              <View style={styles.pendingInfo}>
                <Text style={styles.pendingTitle}>{pendingSyncCount} Offline Transactions Pending</Text>
                <Text style={styles.pendingDesc}>Saved locally in SQLite queue while offline.</Text>
              </View>
            </View>
            <Button
              title="Sync Now with Server"
              style={styles.syncButton}
              onPress={() => navigateTo('/pending')}
            />
          </Card>
        )}

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
  syncButton: {
    backgroundColor: Colors.primary,
  },
});
