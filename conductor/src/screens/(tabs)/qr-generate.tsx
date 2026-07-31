import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import * as Icon from '../../components/Icons';
import { useRouter } from 'expo-router';

const ArrowLeftIcon = Icon.ArrowLeft;
const QrCodeIcon = Icon.QrCode;
const CheckCircleIcon = Icon.CheckCircle;
const ClockIcon = Icon.Clock;
const WifiOffIcon = Icon.WifiOff;

export default function QRGenerationScreen({ onBack }: { onBack?: () => void }) {
  let router: any = null;
  try {
    router = useRouter();
  } catch (e) {}

  const handleBack = () => {
    if (onBack) onBack();
    else if (router?.back) router.back();
  };

  const [isGenerated, setIsGenerated] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes validity
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Simulate QR generation
  const handleGenerate = () => {
    setIsGenerated(true);
    setCountdown(300);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Pulse animation for the QR frame
  useEffect(() => {
    if (isGenerated) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.03, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isGenerated]);

  // Countdown timer
  useEffect(() => {
    if (isGenerated && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isGenerated, countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Mock ticket data for the QR
  const ticketData = {
    ticketId: 'OFL-' + Date.now().toString(36).toUpperCase(),
    route: 'Visakhapatnam → Anakapalle',
    fare: '₹135.00',
    passengers: 1,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Offline Badge */}
        <View style={styles.offlineBadge}>
          {WifiOffIcon && <WifiOffIcon color={Colors.status.warning} size={16} />}
          <Text style={styles.offlineBadgeText}>Offline Mode</Text>
        </View>

        {!isGenerated ? (
          /* Pre-generation state */
          <View style={styles.preGenContainer}>
            <View style={styles.bigIconCircle}>
              {QrCodeIcon && <QrCodeIcon color={Colors.primary} size={56} />}
            </View>
            <Text style={styles.preGenTitle}>Generate Offline QR Ticket</Text>
            <Text style={styles.preGenDesc}>
              Create a secure, encrypted QR code that the passenger can scan to validate their ticket. Works without internet.
            </Text>

            {/* Ticket Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>TICKET SUMMARY</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Route</Text>
                <Text style={styles.summaryValue}>{ticketData.route}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Fare</Text>
                <Text style={[styles.summaryValue, { color: Colors.primary, fontWeight: 'bold' }]}>{ticketData.fare}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Passengers</Text>
                <Text style={styles.summaryValue}>{ticketData.passengers}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Time</Text>
                <Text style={styles.summaryValue}>{ticketData.timestamp}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} activeOpacity={0.8}>
              {QrCodeIcon && <QrCodeIcon color="#FFFFFF" size={22} />}
              <Text style={styles.generateBtnText}>Generate QR Code</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Post-generation state */
          <Animated.View style={[styles.postGenContainer, { opacity: fadeAnim }]}>
            {/* Amount */}
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Ticket Fare</Text>
              <Text style={styles.amountValue}>{ticketData.fare}</Text>
            </View>

            {/* QR Code Card */}
            <Animated.View style={[styles.qrCard, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.qrFrame}>
                {/* Mock QR Code grid */}
                <View style={styles.qrMock}>
                  <View style={styles.qrCornerTL} />
                  <View style={styles.qrCornerTR} />
                  <View style={styles.qrCornerBL} />
                  {/* Center pattern */}
                  <View style={styles.qrCenter}>
                    {QrCodeIcon && <QrCodeIcon color={Colors.primary} size={28} />}
                  </View>
                  {/* Data dots */}
                  {[...Array(6)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.qrDot,
                        {
                          top: 50 + Math.floor(i / 3) * 30,
                          left: 70 + (i % 3) * 20,
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>

              <Text style={styles.ticketId}>{ticketData.ticketId}</Text>

              {/* Timer */}
              <View style={styles.timerContainer}>
                {ClockIcon && <ClockIcon color={countdown > 60 ? Colors.status.success : Colors.status.danger} size={16} />}
                <Text
                  style={[
                    styles.timerText,
                    { color: countdown > 60 ? Colors.status.success : Colors.status.danger },
                  ]}
                >
                  Valid for {formatTime(countdown)}
                </Text>
              </View>
            </Animated.View>

            {/* Instruction */}
            <Text style={styles.qrInstruction}>
              Ask the passenger to scan this QR code using the BusPoint app. The ticket will be validated offline and synced later.
            </Text>

            {/* Success info */}
            <View style={styles.successBanner}>
              {CheckCircleIcon && <CheckCircleIcon color={Colors.status.success} size={20} />}
              <Text style={styles.successText}>QR generated & saved locally. Will sync when online.</Text>
            </View>

            {/* Regenerate */}
            <TouchableOpacity style={styles.regenerateBtn} onPress={handleGenerate} activeOpacity={0.8}>
              <Text style={styles.regenerateBtnText}>Generate New QR</Text>
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

  /* Pre-generation */
  preGenContainer: {
    alignItems: 'center',
  },
  bigIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  preGenTitle: {
    ...Typography.heading,
    fontSize: 22,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  preGenDesc: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },

  /* Summary Card */
  summaryCard: {
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
  summaryLabel: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text.light,
    letterSpacing: 1,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryKey: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },

  /* Generate Button */
  generateBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  generateBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  /* Post-generation */
  postGenContainer: {
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  amountLabel: {
    ...Typography.caption,
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
  },

  /* QR Card */
  qrCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
    width: '100%',
  },
  qrFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FAFBFF',
  },
  qrMock: {
    width: '100%',
    height: '100%',
    backgroundColor: '#111827',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  qrCornerTL: { position: 'absolute', top: 8, left: 8, width: 36, height: 36, borderRadius: 4, backgroundColor: '#FFFFFF' },
  qrCornerTR: { position: 'absolute', top: 8, right: 8, width: 36, height: 36, borderRadius: 4, backgroundColor: '#FFFFFF' },
  qrCornerBL: { position: 'absolute', bottom: 8, left: 8, width: 36, height: 36, borderRadius: 4, backgroundColor: '#FFFFFF' },
  qrCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  ticketId: {
    ...Typography.caption,
    fontWeight: '700',
    color: Colors.text.light,
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  /* Timer */
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  timerText: {
    ...Typography.caption,
    fontWeight: '700',
  },

  qrInstruction: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  /* Success Banner */
  successBanner: {
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
  successText: {
    ...Typography.caption,
    fontSize: 13,
    color: Colors.status.success,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },

  /* Regenerate Button */
  regenerateBtn: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 14,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regenerateBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
