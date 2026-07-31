import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

const { width } = Dimensions.get('window');

const TicketIcon = Icon.Ticket;
const UserCheckIcon = Icon.UserCheck;
const UsersIcon = Icon.Users;
const CloudOffIcon = Icon.CloudOff;
const ArrowRightIcon = Icon.ArrowRight;

const TICKET_CATEGORIES = [
  {
    id: 'normal',
    icon: TicketIcon,
    title: 'Normal',
    description: 'Standard passenger ticket',
    bgColor: Colors.primaryLight,
    iconColor: Colors.primary,
    borderColor: Colors.primary + '30',
  },
  {
    id: 'ladies',
    icon: UserCheckIcon,
    title: 'Ladies',
    description: 'Ticket for eligible female passengers',
    bgColor: '#FDF2F8',
    iconColor: '#DB2777',
    borderColor: '#DB277730',
  },
  {
    id: 'aged',
    icon: UsersIcon,
    title: 'Aged',
    description: 'Ticket for eligible senior passengers',
    bgColor: '#FEF3C7',
    iconColor: '#D97706',
    borderColor: '#D9770630',
  },
  {
    id: 'offline',
    icon: CloudOffIcon,
    title: 'Offline',
    description: 'Issue ticket without internet connectivity',
    bgColor: '#F3F4F6',
    iconColor: '#6B7280',
    borderColor: '#6B728030',
  },
];

export default function TicketsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Issue Ticket</Text>
        <Text style={styles.headerSubtitle}>Select passenger category</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Category Grid */}
        <View style={styles.categoryGrid}>
          {TICKET_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { borderColor: cat.borderColor }]}
              activeOpacity={0.7}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: cat.bgColor }]}>
                {cat.icon && <cat.icon color={cat.iconColor} size={32} />}
              </View>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
              <Text style={styles.categoryDesc}>{cat.description}</Text>
              <View style={[styles.categoryArrow, { backgroundColor: cat.bgColor }]}>
                {ArrowRightIcon && <ArrowRightIcon color={cat.iconColor} size={16} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconCircle}>
            {TicketIcon && <TicketIcon color={Colors.primary} size={20} />}
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Quick Tip</Text>
            <Text style={styles.infoDesc}>
              Select a category to begin issuing tickets. Offline mode allows ticket issuance without internet — transactions sync automatically when connectivity returns.
            </Text>
          </View>
        </View>

        {/* Recent Tickets */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Tickets</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <RecentTicketItem
          type="Normal"
          destination="MVP Colony"
          time="Today, 10:24 AM"
          amount="₹25.00"
          status="success"
        />
        <RecentTicketItem
          type="Ladies"
          destination="Gajuwaka"
          time="Today, 10:15 AM"
          amount="₹45.00"
          status="success"
        />
        <RecentTicketItem
          type="Offline"
          destination="Madhurawada"
          time="Today, 10:02 AM"
          amount="₹60.00"
          status="warning"
        />

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function RecentTicketItem({ type, destination, time, amount, status }: {
  type: string; destination: string; time: string; amount: string; status: 'success' | 'warning';
}) {
  const statusColors = {
    success: { bg: Colors.status.successBg, text: Colors.status.success, label: 'Synced' },
    warning: { bg: Colors.status.warningBg, text: Colors.status.warning, label: 'Pending' },
  };
  const s = statusColors[status];

  return (
    <View style={styles.recentItem}>
      <View style={styles.recentLeft}>
        <View style={[styles.recentTypeBadge, { backgroundColor: Colors.primaryLight }]}>
          <Text style={[styles.recentTypeText, { color: Colors.primary }]}>{type}</Text>
        </View>
        <View>
          <Text style={styles.recentDest}>{destination}</Text>
          <Text style={styles.recentTime}>{time}</Text>
        </View>
      </View>
      <View style={styles.recentRight}>
        <Text style={styles.recentAmount}>{amount}</Text>
        <View style={[styles.recentStatusChip, { backgroundColor: s.bg }]}>
          <Text style={[styles.recentStatusText, { color: s.text }]}>{s.label}</Text>
        </View>
      </View>
    </View>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  scrollContent: {
    padding: 20,
  },

  // Category Grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 24,
  },
  categoryCard: {
    width: (width - 54) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  categoryIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    ...Typography.section,
    color: Colors.text.primary,
    marginBottom: 6,
  },
  categoryDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    lineHeight: 16,
    marginBottom: 16,
  },
  categoryArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 14,
    alignItems: 'flex-start',
  },
  infoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    ...Typography.cardTitle,
    color: Colors.primary,
    marginBottom: 4,
  },
  infoDesc: {
    ...Typography.caption,
    color: Colors.primaryDark,
    lineHeight: 18,
  },

  // Recent Tickets
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    ...Typography.section,
    color: Colors.text.primary,
  },
  viewAllText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  recentItem: {
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
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  recentTypeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  recentDest: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
    fontSize: 14,
  },
  recentTime: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  recentRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  recentAmount: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  recentStatusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  recentStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
