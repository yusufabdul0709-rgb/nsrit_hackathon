import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import * as Icon from '../../components/Icons';

import { StatusChip } from '../../components/StatusChip';
import { Card } from '../../components/Card';

const ArrowLeftIcon = Icon.ArrowLeft;
const CloudOffIcon = Icon.CloudOff;
const RefreshCwIcon = Icon.RefreshCw;

import { getPendingTransactions } from '../../services/database';

// Helper function to format timestamp
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function PendingScreen({ onBack }: { onBack?: () => void }) {
  const [pendingMembers, setPendingMembers] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const txs = await getPendingTransactions();
        setPendingMembers(txs);
      } catch (e) {
        console.error('Failed to load pending transactions:', e);
      }
    };
    fetchTransactions();
    
    // Set up a polling interval just in case they switch tabs
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router?.back) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          {ArrowLeftIcon && <ArrowLeftIcon color={Colors.text.primary} size={24} />}
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Pending Members</Text>
          <Text style={styles.headerSubtitle}>Offline Transactions</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Info Banner */}
        <Card style={styles.infoBanner} padding={16}>
          <View style={styles.infoIconCircle}>
            {CloudOffIcon && <CloudOffIcon color={Colors.status.warning} size={20} />}
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Waiting for connection</Text>
            <Text style={styles.infoDesc}>
              These payments were recorded offline and will automatically sync to the server when internet is restored.
            </Text>
          </View>
        </Card>

        {/* List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Pending Members ({pendingMembers.length})</Text>
          <TouchableOpacity style={styles.syncBtn}>
            {RefreshCwIcon && <RefreshCwIcon color={Colors.primary} size={14} />}
            <Text style={styles.syncBtnText}>Sync Queue</Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        {pendingMembers.map((tx) => (
          <View key={tx.transactionId} style={styles.txRow}>
            <View style={styles.txLeft}>
              <Text style={styles.txDest}>{tx.journey}</Text>
              <View style={styles.txMeta}>
                <Text style={styles.txTime}>{formatTime(tx.createdAt)}</Text>
                <View style={styles.txDot} />
                <Text style={styles.txType}>{tx.walletReference || 'Passenger'}</Text>
                <View style={styles.txDot} />
                <Text style={styles.txPassengers}>{tx.transactionId.substring(0, 8)}</Text>
              </View>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txAmount}>₹{tx.amount}</Text>
              <StatusChip label="Pending" status="warning" />
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.heading,
    color: Colors.text.primary,
    fontSize: 20,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
  },
  
  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.status.warningBg,
    borderColor: Colors.status.warning + '30',
    borderWidth: 1,
    marginBottom: 24,
    gap: 14,
  },
  infoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    ...Typography.cardTitle,
    color: Colors.status.warning,
    marginBottom: 4,
  },
  infoDesc: {
    ...Typography.caption,
    color: '#92400E',
    lineHeight: 18,
  },

  // List Header
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.section,
    color: Colors.text.primary,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncBtnText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Transactions
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
    fontSize: 15,
    marginBottom: 6,
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
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.text.light,
  },
  txType: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  txPassengers: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  txAmount: {
    ...Typography.cardTitle,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
});
