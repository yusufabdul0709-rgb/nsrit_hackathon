import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Card } from '../../components/Card';
import { StatusChip } from '../../components/StatusChip';

const { width } = Dimensions.get('window');

const TicketIcon = Icon.Ticket;
const IndianRupeeIcon = Icon.IndianRupee;
const UsersIcon = Icon.Users;
const CreditCardIcon = Icon.CreditCard;
const CloudOffIcon = Icon.CloudOff;
const RefreshCwIcon = Icon.RefreshCw;
const WifiIcon = Icon.Wifi;
const CalendarIcon = Icon.Calendar;
const TrendingUpIcon = Icon.TrendingUp;

// ─── Summary Stats ───
const SUMMARY_STATS = [
  { label: 'Tickets Issued', value: '126', icon: TicketIcon, color: Colors.primary },
  { label: 'Total Passengers', value: '142', icon: UsersIcon, color: '#7C3AED' },
  { label: 'Cash Collected', value: '₹2,450', icon: IndianRupeeIcon, color: '#059669' },
  { label: 'Digital Payments', value: '₹1,280', icon: CreditCardIcon, color: '#0891B2' },
  { label: 'Offline Transactions', value: '18', icon: CloudOffIcon, color: '#D97706' },
  { label: 'Pending Sync', value: '3', icon: RefreshCwIcon, color: Colors.status.danger },
];

// ─── Category Breakdown ───
const CATEGORIES = [
  { type: 'Normal', count: 84, percentage: 67, color: Colors.primary },
  { type: 'Ladies', count: 28, percentage: 22, color: '#DB2777' },
  { type: 'Aged', count: 14, percentage: 11, color: '#D97706' },
];

// ─── Transaction History ───
const TRANSACTIONS = [
  { id: '1', dest: 'MVP Colony', type: 'Normal', amount: '₹25.00', time: '10:24 AM', mode: 'Cash', status: 'success' as const },
  { id: '2', dest: 'Gajuwaka', type: 'Ladies', amount: '₹45.00', time: '10:15 AM', mode: 'UPI', status: 'success' as const },
  { id: '3', dest: 'Madhurawada', type: 'Normal', amount: '₹60.00', time: '10:02 AM', mode: 'Offline', status: 'warning' as const },
  { id: '4', dest: 'Sabbavaram', type: 'Aged', amount: '₹30.00', time: '09:48 AM', mode: 'Cash', status: 'success' as const },
  { id: '5', dest: 'NAD Junction', type: 'Normal', amount: '₹35.00', time: '09:30 AM', mode: 'Cash', status: 'success' as const },
];

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Reports</Text>
          <Text style={styles.headerSubtitle}>Daily summary & analytics</Text>
        </View>
        <View style={styles.dateChip}>
          {CalendarIcon && <CalendarIcon color={Colors.primary} size={14} />}
          <Text style={styles.dateChipText}>Today</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ──── Today's Summary ──── */}
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.summaryGrid}>
          {SUMMARY_STATS.map((stat, i) => (
            <View key={i} style={styles.summaryItem}>
              <View style={[styles.summaryIconCircle, { backgroundColor: stat.color + '14' }]}>
                {stat.icon && <stat.icon color={stat.color} size={18} />}
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>{stat.label}</Text>
                <Text style={[styles.summaryValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ──── Daily Collection ──── */}
        <Text style={styles.sectionTitle}>Daily Collection</Text>
        <Card style={styles.collectionCard} padding={20}>
          <View style={styles.collectionHeader}>
            <View>
              <Text style={styles.collectionLabel}>Total Collection</Text>
              <Text style={styles.collectionAmount}>₹3,730</Text>
            </View>
            <View style={styles.collectionTrend}>
              {TrendingUpIcon && <TrendingUpIcon color={Colors.status.success} size={16} />}
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </View>
          
          {/* Collection Breakdown */}
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.breakdownLabel}>Cash</Text>
              <Text style={styles.breakdownValue}>₹2,450</Text>
            </View>
            <View style={styles.breakdownItem}>
              <View style={[styles.breakdownDot, { backgroundColor: '#0891B2' }]} />
              <Text style={styles.breakdownLabel}>Digital</Text>
              <Text style={styles.breakdownValue}>₹1,280</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%', backgroundColor: Colors.primary }]} />
            <View style={[styles.progressFill, { width: '34%', backgroundColor: '#0891B2' }]} />
          </View>
        </Card>

        {/* ──── Ticket Category Breakdown ──── */}
        <Text style={styles.sectionTitle}>Ticket Categories</Text>
        <Card style={styles.categoryCard} padding={20}>
          {CATEGORIES.map((cat, i) => (
            <View key={i} style={[styles.categoryRow, i < CATEGORIES.length - 1 && styles.categoryRowBorder]}>
              <View style={styles.categoryLeft}>
                <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                <Text style={styles.categoryType}>{cat.type}</Text>
              </View>
              <View style={styles.categoryRight}>
                <Text style={styles.categoryCount}>{cat.count}</Text>
                <View style={styles.percentageBar}>
                  <View style={[styles.percentageFill, { width: `${cat.percentage}%`, backgroundColor: cat.color }]} />
                </View>
                <Text style={[styles.categoryPercent, { color: cat.color }]}>{cat.percentage}%</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* ──── Online vs Offline ──── */}
        <Text style={styles.sectionTitle}>Connectivity Breakdown</Text>
        <Card padding={20} style={styles.connectivityCard}>
          <View style={styles.connRow}>
            <View style={[styles.connCard, { backgroundColor: Colors.status.successBg }]}>
              <View style={styles.connIconRow}>
                {WifiIcon && <WifiIcon color={Colors.status.success} size={20} />}
              </View>
              <Text style={[styles.connValue, { color: Colors.status.success }]}>108</Text>
              <Text style={styles.connLabel}>Online</Text>
            </View>
            <View style={[styles.connCard, { backgroundColor: Colors.status.warningBg }]}>
              <View style={styles.connIconRow}>
                {CloudOffIcon && <CloudOffIcon color={Colors.status.warning} size={20} />}
              </View>
              <Text style={[styles.connValue, { color: Colors.status.warning }]}>18</Text>
              <Text style={styles.connLabel}>Offline</Text>
            </View>
          </View>
        </Card>

        {/* ──── Transaction History ──── */}
        <Text style={styles.sectionTitle}>Transaction History</Text>
        {TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={styles.txRow}>
            <View style={styles.txLeft}>
              <Text style={styles.txDest}>{tx.dest}</Text>
              <View style={styles.txMeta}>
                <Text style={styles.txTime}>{tx.time}</Text>
                <View style={styles.txDot} />
                <Text style={styles.txMode}>{tx.mode}</Text>
                <View style={styles.txDot} />
                <Text style={styles.txType}>{tx.type}</Text>
              </View>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txAmount}>{tx.amount}</Text>
              <StatusChip label={tx.status === 'success' ? 'Synced' : 'Pending'} status={tx.status} />
            </View>
          </View>
        ))}

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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dateChipText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    ...Typography.section,
    color: Colors.text.primary,
    marginBottom: 14,
    marginTop: 8,
  },

  // Summary Grid
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  summaryItem: {
    width: (width - 50) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  summaryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Collection Card
  collectionCard: {
    marginBottom: 20,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  collectionLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  collectionAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  collectionTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.status.successBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.status.success,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 14,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  breakdownDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  breakdownLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  breakdownValue: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Colors.border,
  },
  progressFill: {
    height: 8,
  },

  // Category Card
  categoryCard: {
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  categoryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryType: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryCount: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.text.primary,
    minWidth: 30,
    textAlign: 'right',
  },
  percentageBar: {
    width: 80,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  percentageFill: {
    height: 6,
    borderRadius: 3,
  },
  categoryPercent: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 36,
    textAlign: 'right',
  },

  // Connectivity Card
  connectivityCard: {
    marginBottom: 20,
  },
  connRow: {
    flexDirection: 'row',
    gap: 14,
  },
  connCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  connIconRow: {
    marginBottom: 10,
  },
  connValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  connLabel: {
    ...Typography.body,
    color: Colors.text.secondary,
    fontWeight: '500',
  },

  // Transaction History
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  txLeft: {
    flex: 1,
  },
  txDest: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
    fontSize: 14,
    marginBottom: 4,
  },
  txMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  txTime: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  txDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.text.light,
  },
  txMode: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  txType: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  txAmount: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
});
