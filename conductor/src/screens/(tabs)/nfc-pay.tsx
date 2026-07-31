import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import * as Icon from '../../components/Icons';
import { useRouter } from 'expo-router';

const ArrowLeftIcon = Icon.ArrowLeft;
const NfcIcon = Icon.Nfc;
const SmartphoneIcon = Icon.Smartphone;
const CheckCircleIcon = Icon.CheckCircle;
const WifiOffIcon = Icon.WifiOff;
const AlertCircleIcon = Icon.AlertCircle;

type NfcStatus = 'idle' | 'scanning' | 'success' | 'error';

export default function NfcPayScreen({ onBack }: { onBack?: () => void }) {
  let router: any = null;
  try {
    router = useRouter();
  } catch (e) {}

  const handleBack = () => {
    if (onBack) onBack();
    else if (router?.back) router.back();
  };

  const [nfcStatus, setNfcStatus] = useState<NfcStatus>('idle');
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0.6)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Ripple animation loop during scanning
  useEffect(() => {
    if (nfcStatus === 'scanning') {
      const ripple = Animated.loop(
        Animated.parallel([
          Animated.timing(rippleAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(rippleOpacity, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ])
      );
      ripple.start();

      // Simulate NFC detection after 3 seconds
      const timer = setTimeout(() => {
        ripple.stop();
        setNfcStatus('success');
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 3000);

      return () => {
        ripple.stop();
        clearTimeout(timer);
      };
    }
  }, [nfcStatus]);

  // Pulse animation for idle icon
  useEffect(() => {
    if (nfcStatus === 'idle') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [nfcStatus]);

  const handleStartScan = () => {
    setNfcStatus('scanning');
    rippleAnim.setValue(0);
    rippleOpacity.setValue(0.6);
  };

  const handleReset = () => {
    setNfcStatus('idle');
    fadeAnim.setValue(0);
    rippleAnim.setValue(0);
    rippleOpacity.setValue(0.6);
  };

  // Mock transaction data
  const txData = {
    txId: 'NFC-' + Date.now().toString(36).toUpperCase(),
    cardId: '**** **** 7842',
    route: 'Visakhapatnam → Anakapalle',
    fare: '₹135.00',
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          {ArrowLeftIcon && <ArrowLeftIcon color={Colors.text.primary} size={24} />}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NFC Tap-to-Pay</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Offline Badge */}
        <View style={styles.offlineBadge}>
          {WifiOffIcon && <WifiOffIcon color={Colors.status.warning} size={16} />}
          <Text style={styles.offlineBadgeText}>Offline Mode</Text>
        </View>

        {nfcStatus === 'idle' && (
          <View style={styles.idleContainer}>
            <Animated.View style={[styles.nfcIconCircle, { transform: [{ scale: pulseAnim }] }]}>
              {NfcIcon && <NfcIcon color="#059669" size={64} />}
            </Animated.View>
            <Text style={styles.idleTitle}>Ready for NFC</Text>
            <Text style={styles.idleDesc}>
              Tap the passenger's NFC-enabled smart card or device against this phone to instantly process their ticket.
            </Text>

            {/* How it works */}
            <View style={styles.stepsCard}>
              <Text style={styles.stepsLabel}>HOW IT WORKS</Text>
              {[
                { step: '1', text: 'Tap "Start NFC Scan" below' },
                { step: '2', text: "Hold passenger's card against your phone" },
                { step: '3', text: 'Ticket is issued & stored offline' },
                { step: '4', text: 'Syncs automatically when online' },
              ].map((item) => (
                <View key={item.step} style={styles.stepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepNumber}>{item.step}</Text>
                  </View>
                  <Text style={styles.stepText}>{item.text}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.startBtn} onPress={handleStartScan} activeOpacity={0.8}>
              {SmartphoneIcon && <SmartphoneIcon color="#FFFFFF" size={22} />}
              <Text style={styles.startBtnText}>Start NFC Scan</Text>
            </TouchableOpacity>
          </View>
        )}

        {nfcStatus === 'scanning' && (
          <View style={styles.scanningContainer}>
            <View style={styles.scanningVisual}>
              {/* Ripple rings */}
              <Animated.View
                style={[
                  styles.rippleRing,
                  styles.rippleRingOuter,
                  {
                    opacity: rippleOpacity,
                    transform: [
                      {
                        scale: rippleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.rippleRing,
                  styles.rippleRingInner,
                  {
                    opacity: rippleOpacity.interpolate({
                      inputRange: [0, 0.6],
                      outputRange: [0, 0.4],
                      extrapolate: 'clamp',
                    }),
                    transform: [
                      {
                        scale: rippleAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <View style={styles.scanningIconCircle}>
                {NfcIcon && <NfcIcon color="#059669" size={48} />}
              </View>
            </View>

            <Text style={styles.scanningTitle}>Scanning for NFC...</Text>
            <Text style={styles.scanningDesc}>
              Hold the passenger's smart card or NFC device close to the back of your phone.
            </Text>

            <TouchableOpacity style={styles.cancelBtn} onPress={handleReset} activeOpacity={0.8}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {nfcStatus === 'success' && (
          <Animated.View style={[styles.successContainer, { opacity: fadeAnim }]}>
            <View style={styles.successIconCircle}>
              {CheckCircleIcon && <CheckCircleIcon color="#FFFFFF" size={48} />}
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successDesc}>NFC card detected and ticket issued successfully.</Text>

            {/* Transaction details */}
            <View style={styles.txCard}>
              <Text style={styles.txLabel}>TRANSACTION DETAILS</Text>
              <View style={styles.txRow}>
                <Text style={styles.txKey}>Transaction ID</Text>
                <Text style={styles.txValue}>{txData.txId}</Text>
              </View>
              <View style={styles.txDivider} />
              <View style={styles.txRow}>
                <Text style={styles.txKey}>Card</Text>
                <Text style={styles.txValue}>{txData.cardId}</Text>
              </View>
              <View style={styles.txDivider} />
              <View style={styles.txRow}>
                <Text style={styles.txKey}>Route</Text>
                <Text style={styles.txValue}>{txData.route}</Text>
              </View>
              <View style={styles.txDivider} />
              <View style={styles.txRow}>
                <Text style={styles.txKey}>Fare</Text>
                <Text style={[styles.txValue, { color: Colors.primary, fontWeight: 'bold' }]}>{txData.fare}</Text>
              </View>
              <View style={styles.txDivider} />
              <View style={styles.txRow}>
                <Text style={styles.txKey}>Time</Text>
                <Text style={styles.txValue}>{txData.timestamp}</Text>
              </View>
            </View>

            {/* Sync notice */}
            <View style={styles.syncBanner}>
              {CheckCircleIcon && <CheckCircleIcon color={Colors.status.success} size={18} />}
              <Text style={styles.syncText}>Transaction saved locally. Will sync when online.</Text>
            </View>

            <TouchableOpacity style={styles.newTxBtn} onPress={handleReset} activeOpacity={0.8}>
              {SmartphoneIcon && <SmartphoneIcon color="#FFFFFF" size={20} />}
              <Text style={styles.newTxBtnText}>New NFC Transaction</Text>
            </TouchableOpacity>
          </Animated.View>
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
    padding: 20,
    paddingBottom: 40,
  },

  /* Offline Badge */
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.status.warningBg,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.status.warning + '40',
  },
  offlineBadgeText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.status.warning,
  },

  /* ─── IDLE STATE ─── */
  idleContainer: {
    alignItems: 'center',
  },
  nfcIconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  idleTitle: {
    ...Typography.heading,
    fontSize: 22,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  idleDesc: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },

  /* Steps Card */
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  stepsLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text.light,
    letterSpacing: 1,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 14,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#059669',
  },
  stepText: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1,
  },

  /* Start Button */
  startBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* ─── SCANNING STATE ─── */
  scanningContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  scanningVisual: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  rippleRing: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
  },
  rippleRingOuter: {
    width: 100,
    height: 100,
    borderColor: '#059669',
  },
  rippleRingInner: {
    width: 80,
    height: 80,
    borderColor: '#34D399',
  },
  scanningIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#059669',
  },
  scanningTitle: {
    ...Typography.heading,
    fontSize: 22,
    color: '#059669',
    marginBottom: 12,
  },
  scanningDesc: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 12,
  },
  cancelBtn: {
    borderWidth: 2,
    borderColor: Colors.status.danger,
    borderRadius: 14,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.status.danger,
  },

  /* ─── SUCCESS STATE ─── */
  successContainer: {
    alignItems: 'center',
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    ...Typography.heading,
    fontSize: 24,
    color: '#059669',
    marginBottom: 8,
  },
  successDesc: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 28,
  },

  /* Transaction Card */
  txCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  txLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text.light,
    letterSpacing: 1,
    marginBottom: 16,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  txKey: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  txValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },
  txDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },

  /* Sync Banner */
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.successBg,
    borderRadius: 12,
    padding: 16,
    gap: 10,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.status.success + '30',
  },
  syncText: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.status.success,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },

  /* New Transaction Button */
  newTxBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newTxBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
