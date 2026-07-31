import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';

const SearchIcon = Icon.Search;
const MapPinIcon = Icon.MapPin;
const IndianRupeeIcon = Icon.IndianRupee;
const QrCodeIcon = Icon.QrCode || Icon.ScanQrCode;
const ChevronRightIcon = Icon.ChevronRight;

const DESTINATIONS = [
  { id: '1', name: 'MVP Colony', fare: 25, eta: '12 min' },
  { id: '2', name: 'Madhurawada', fare: 45, eta: '42 min' },
  { id: '3', name: 'Gajuwaka', fare: 60, eta: '1h 15m' },
];

export default function TicketsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Issue Ticket</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search */}
        <View style={styles.searchContainer}>
          {SearchIcon && <SearchIcon color={Colors.text.secondary} size={20} style={styles.searchIcon as any} />}
          <TextInput 
            style={styles.searchInput}
            placeholder="Search destination..."
            placeholderTextColor={Colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Destinations */}
        <Text style={styles.sectionTitle}>Upcoming Stops</Text>
        
        {DESTINATIONS.map((dest) => (
          <TouchableOpacity key={dest.id} activeOpacity={0.7} style={styles.destinationRow}>
            <View style={styles.destinationIcon}>
              {MapPinIcon && <MapPinIcon color={Colors.primary} size={20} />}
            </View>
            <View style={styles.destinationInfo}>
              <Text style={styles.destinationName}>{dest.name}</Text>
              <Text style={styles.destinationEta}>{dest.eta}</Text>
            </View>
            <View style={styles.fareContainer}>
              <Text style={styles.fareAmount}>₹{dest.fare}</Text>
              {ChevronRightIcon && <ChevronRightIcon color={Colors.text.secondary} size={20} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Ticket Generation Card (Demo state) */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Transactions</Text>
        <Card style={styles.recentCard}>
          <View style={styles.transactionHeader}>
            <View>
              <Text style={styles.txPassenger}>1x Adult to MVP Colony</Text>
              <Text style={styles.txTime}>Today, 10:24 AM</Text>
            </View>
            <StatusChip label="Success" status="success" />
          </View>
          <View style={styles.txFooter}>
            <View style={styles.txPayment}>
              {QrCodeIcon && <QrCodeIcon color={Colors.text.secondary} size={16} />}
              <Text style={styles.txPaymentMethod}>UPI Scan</Text>
            </View>
            <Text style={styles.txAmount}>₹25.00</Text>
          </View>
        </Card>
        
        <Card style={styles.recentCard}>
          <View style={styles.transactionHeader}>
            <View>
              <Text style={styles.txPassenger}>2x Adult to Gajuwaka</Text>
              <Text style={styles.txTime}>Today, 10:15 AM</Text>
            </View>
            <StatusChip label="Pending" status="warning" />
          </View>
          <View style={styles.txFooter}>
            <View style={styles.txPayment}>
              {IndianRupeeIcon && <IndianRupeeIcon color={Colors.text.secondary} size={16} />}
              <Text style={styles.txPaymentMethod}>Cash Offline</Text>
            </View>
            <Text style={styles.txAmount}>₹120.00</Text>
          </View>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, paddingBottom: 16 },
  headerTitle: { ...Typography.heading, color: Colors.text.primary },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: Colors.border, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, ...Typography.body, color: Colors.text.primary, height: '100%' },
  sectionTitle: { ...Typography.section, color: Colors.text.primary, marginBottom: 16 },
  destinationRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  destinationIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F4FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  destinationInfo: { flex: 1 },
  destinationName: { ...Typography.cardTitle, color: Colors.text.primary, marginBottom: 4 },
  destinationEta: { ...Typography.caption, color: Colors.text.secondary },
  fareContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fareAmount: { ...Typography.cardTitle, color: Colors.text.primary, fontWeight: 'bold' },
  recentCard: { marginBottom: 16, padding: 20 },
  transactionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  txPassenger: { ...Typography.body, fontWeight: '600', color: Colors.text.primary },
  txTime: { ...Typography.caption, color: Colors.text.secondary, marginTop: 4 },
  txFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  txPayment: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  txPaymentMethod: { ...Typography.caption, color: Colors.text.secondary },
  txAmount: { ...Typography.body, fontWeight: 'bold', color: Colors.text.primary }
});
