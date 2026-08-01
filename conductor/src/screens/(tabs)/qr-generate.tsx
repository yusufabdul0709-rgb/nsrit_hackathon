import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import * as Icon from '../../components/Icons';

import { generatePaymentRequest, mockPassengerResponse, verifyPassengerToken } from '../../services/cryptoService';
import { saveTransaction } from '../../services/database';

const ArrowLeftIcon = Icon.ArrowLeft;
const CheckCircleIcon = Icon.CheckCircle;
const ClockIcon = Icon.Clock;
const ShieldCheckIcon = Icon.ShieldCheck;

export default function QRGenerationScreen({ onBack, details }: { onBack?: () => void, details?: any }) {
  const [requestObj, setRequestObj] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState<'SHOWING_QR' | 'EXPIRED' | 'SUCCESS'>('SHOWING_QR');

  const handleBack = () => {
    if (onBack) onBack();
  };

  useEffect(() => {
    if (details) {
      const req = generatePaymentRequest({
        amount: details.amount,
        journey: details.journey,
        passengerType: details.passengerType
      });
      setRequestObj(req);
    }
  }, [details]);

  useEffect(() => {
    if (status !== 'SHOWING_QR') return;
    
    if (timeLeft <= 0) {
      setStatus('EXPIRED');
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleSimulatePassenger = async () => {
    if (!requestObj) return;
    
    // Simulate passenger scanning and generating response token
    const encryptedTokenBase64 = mockPassengerResponse(requestObj);
    
    // Conductor receives and verifies it
    const result = verifyPassengerToken(encryptedTokenBase64, requestObj.requestId);
    
    if (result.success) {
      // Save to SQLite
      await saveTransaction({
        transactionId: result.transactionId!,
        requestId: requestObj.requestId,
        walletReference: result.walletReference!,
        amount: result.amount!,
        journey: details?.journey || 'Unknown',
        status: 'PENDING_SETTLEMENT',
        createdAt: Date.now()
      });
      
      setStatus('SUCCESS');
    } else {
      Alert.alert('Verification Failed', result.error);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          {ArrowLeftIcon && <ArrowLeftIcon color={Colors.text.primary} size={24} />}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR Generation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {status === 'SHOWING_QR' && requestObj && (
          <View style={styles.qrContainer}>
            <View style={styles.secureHeaderRow}>
              {ShieldCheckIcon && <ShieldCheckIcon color="#059669" size={20} />}
              <Text style={styles.qrHeader}>Secure Payment Request</Text>
            </View>
            
            <Text style={styles.qrAmount}>₹{details?.amount || 0}</Text>
            <Text style={styles.journeyText}>{details?.journey}</Text>
            
            <View style={styles.qrBox}>
              <QRCode
                value={JSON.stringify(requestObj)}
                size={240}
                color="black"
                backgroundColor="white"
              />
            </View>
            
            <View style={styles.timerRow}>
              {ClockIcon && <ClockIcon color={Colors.status.warning} size={20} />}
              <Text style={styles.timerText}>Expires in: {formatTime(timeLeft)}</Text>
            </View>
            
            <Text style={styles.instruction}>
              Ask the passenger to scan this QR code with their APSRTC Wallet app to authorize the offline payment.
            </Text>
            
            <View style={styles.divider} />
            
            {/* For Prototyping */}
            <TouchableOpacity style={styles.simulateBtn} onPress={handleSimulatePassenger}>
              <Text style={styles.simulateBtnText}>Test: Simulate Passenger Scan</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'EXPIRED' && (
          <View style={styles.statusContainer}>
            <View style={[styles.statusIconCircle, { backgroundColor: '#FEE2E2' }]}>
              {ClockIcon && <ClockIcon color="#EF4444" size={48} />}
            </View>
            <Text style={styles.statusTitle}>QR Expired</Text>
            <Text style={styles.statusDesc}>
              The secure offline payment request has timed out for security reasons. Please generate a new ticket.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleBack}>
              <Text style={styles.primaryBtnText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'SUCCESS' && (
          <View style={styles.statusContainer}>
            <View style={[styles.statusIconCircle, { backgroundColor: '#D1FAE5' }]}>
              {CheckCircleIcon && <CheckCircleIcon color="#059669" size={48} />}
            </View>
            <Text style={styles.statusTitle}>Offline Authorized</Text>
            <Text style={styles.statusDesc}>
              The passenger's cryptographic token was verified successfully. 
              The transaction is safely stored in Pending Members and will sync when internet returns.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleBack}>
              <Text style={styles.primaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...Typography.heading,
    fontSize: 18,
    color: Colors.text.primary,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  secureHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  qrHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  qrAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  journeyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  qrBox: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.status.warningBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.status.warning,
  },
  instruction: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 24,
  },
  simulateBtn: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  simulateBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  statusDesc: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
