import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

const TrendingUpIcon = Icon.TrendingUp;
const TrendingDownIcon = Icon.TrendingDown;
const IndianRupeeIcon = Icon.IndianRupee;
const UsersIcon = Icon.Users;
const TicketIcon = Icon.Ticket;
const DownloadIcon = Icon.Download;

export default function ReportsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Report</Text>
        <View style={styles.dateChip}>
          <Text style={styles.dateText}>Today, Oct 24</Text>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Main Revenue Card */}
        <Card style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Total Collection</Text>
          <Text style={styles.revenueAmount}>₹12,450</Text>
          <View style={styles.trendContainer}>
            {TrendingUpIcon && <TrendingUpIcon color={Colors.status.success} size={16} />}
            <Text style={styles.trendText}>+14% vs yesterday</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Breakdown</Text>
        
        <View style={styles.gridContainer}>
          <Card padding={16} style={styles.gridCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#E7F9F0' }]}>
              {IndianRupeeIcon && <IndianRupeeIcon color={Colors.status.success} size={20} />}
            </View>
            <Text style={styles.gridValue}>₹8,200</Text>
            <Text style={styles.gridLabel}>Cash</Text>
          </Card>
          
          <Card padding={16} style={styles.gridCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#F0F4FF' }]}>
              {TicketIcon && <TicketIcon color={Colors.primary} size={20} />}
            </View>
            <Text style={styles.gridValue}>₹4,250</Text>
            <Text style={styles.gridLabel}>UPI/QR</Text>
          </Card>
          
          <Card padding={16} style={styles.gridCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF1E8' }]}>
              {UsersIcon && <UsersIcon color={Colors.status.offline} size={20} />}
            </View>
            <Text style={styles.gridValue}>342</Text>
            <Text style={styles.gridLabel}>Passengers</Text>
          </Card>
          
          <Card padding={16} style={styles.gridCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFF7E6' }]}>
              {TrendingDownIcon && <TrendingDownIcon color={Colors.status.warning} size={20} />}
            </View>
            <Text style={styles.gridValue}>12</Text>
            <Text style={styles.gridLabel}>Offline Sync</Text>
          </Card>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Actions</Text>
        <Button 
          title="Download Report" 
          variant="outline" 
          icon={DownloadIcon && <DownloadIcon color={Colors.primary} size={20} />} 
          style={{ marginBottom: 16 }}
        />
        <Button 
          title="End Duty & Submit Cash" 
          variant="primary" 
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: 16 },
  headerTitle: { ...Typography.heading, color: Colors.text.primary },
  dateChip: { backgroundColor: Colors.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  dateText: { ...Typography.caption, fontWeight: '600', color: Colors.text.secondary },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  revenueCard: { alignItems: 'center', paddingVertical: 32, marginBottom: 24 },
  revenueLabel: { ...Typography.body, color: Colors.text.secondary, marginBottom: 8 },
  revenueAmount: { fontSize: 48, fontWeight: 'bold', color: Colors.primary, marginBottom: 12 },
  trendContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E7F9F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  trendText: { ...Typography.caption, color: Colors.status.success, fontWeight: '600' },
  sectionTitle: { ...Typography.section, color: Colors.text.primary, marginBottom: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  gridCard: { width: '47%' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  gridValue: { ...Typography.section, color: Colors.text.primary, marginBottom: 4 },
  gridLabel: { ...Typography.caption, color: Colors.text.secondary }
});
