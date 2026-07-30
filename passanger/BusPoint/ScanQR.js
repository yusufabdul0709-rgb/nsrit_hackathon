import React, { useEffect, useRef, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  Animated, 
  Platform,
  StatusBar,
  Dimensions,
  Button
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { 
  ArrowLeft, 
  Flashlight, 
  HelpCircle, 
  Wifi, 
  WifiOff, 
  Image as ImageIcon, 
  Keyboard, 
  CreditCard, 
  Wallet,
  CheckCircle2,
  AlertCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#004CFF',
  secondary: '#3F74F9',
  background: '#F6F8FC',
  surface: '#FFFFFF',
  cardBorder: '#E8EEF9',
  primaryText: '#0F172A',
  secondaryText: '#64748B',
  divider: '#E5E7EB',
  success: '#16C47F',
  warning: '#FFB020',
  offlineOrange: '#F97316',
  error: '#F04438',
};

export default function ScanQR({ onBack }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isOffline, setIsOffline] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Loop the scanning line animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 240, // Height of the scanner area
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Toggle offline mode every 5 seconds for demonstration
    const interval = setInterval(() => {
      setIsOffline(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, [scanLineAnim]);

  const handleBarcodeScanned = ({ type, data }) => {
    // Stop continuous scanning temporarily by setting a timeout or state
    // For hackathon, just alert the scan result:
    alert(`Ticket Scanned Successfully!\nData: ${data}`);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need camera access to scan your BusPoint ticket.</Text>
        <TouchableOpacity style={styles.quickBtn} onPress={requestPermission}>
          <Text style={styles.quickBtnText}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 24 }} onPress={onBack}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={onBack}>
          <ArrowLeft color={COLORS.primaryText} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Ticket</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Flashlight color={COLORS.primaryText} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]}>
            <HelpCircle color={COLORS.primaryText} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scanner Area */}
      <View style={styles.scannerContainer}>
        <View style={styles.scannerFrame}>
          <CameraView 
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
          />
          {/* Corner brackets */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          
          {/* Animated Scanning Line */}
          <Animated.View 
            style={[
              styles.scanLine, 
              { transform: [{ translateY: scanLineAnim }] }
            ]} 
          />
        </View>
        <Text style={styles.instructionText}>
          Scan the QR displayed by the conductor
        </Text>
      </View>

      {/* Dynamic Network Status Card */}
      <View style={styles.statusContainer}>
        {isOffline ? (
          <View style={[styles.statusCard, styles.offlineCard]}>
            <View style={styles.statusHeader}>
              <WifiOff color={COLORS.offlineOrange} size={24} />
              <View style={styles.offlineBadge}>
                <Text style={styles.offlineBadgeText}>OFFLINE MODE</Text>
              </View>
            </View>
            <Text style={styles.offlineTitle}>Offline Ticket Mode</Text>
            <Text style={styles.offlineDesc}>
              Continue your journey. Payment will automatically sync once internet is available.
            </Text>
          </View>
        ) : (
          <View style={styles.statusCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckCircle2 color={COLORS.success} size={24} />
              <View style={styles.onlineTextContainer}>
                <Text style={styles.onlineTitle}>Internet Connected</Text>
                <Text style={styles.onlineDesc}>Ready for ultra-fast UPI payments</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Quick Buttons */}
      <View style={styles.quickButtonsRow}>
        <TouchableOpacity style={styles.quickBtn}>
          <ImageIcon color={COLORS.primary} size={20} />
          <Text style={styles.quickBtnText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn}>
          <Keyboard color={COLORS.primary} size={20} />
          <Text style={styles.quickBtnText}>Enter Code</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Information */}
      <View style={styles.supportedPayments}>
        <Text style={styles.supportedLabel}>SUPPORTED PAYMENTS</Text>
        <View style={styles.paymentChips}>
          <View style={styles.chip}>
            <CreditCard color={COLORS.secondaryText} size={16} />
            <Text style={styles.chipText}>UPI</Text>
          </View>
          <View style={styles.chip}>
            <Wallet color={COLORS.secondaryText} size={16} />
            <Text style={styles.chipText}>Wallet</Text>
          </View>
          <View style={styles.chip}>
            <AlertCircle color={COLORS.secondaryText} size={16} />
            <Text style={styles.chipText}>BusPass</Text>
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryText,
  },
  headerRight: {
    flexDirection: 'row',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.primaryText,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  
  // Scanner Area
  scannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'rgba(0, 76, 255, 0.03)',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(0, 76, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 28,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 28,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 28,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 28,
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  instructionText: {
    marginTop: 24,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.secondaryText,
  },

  // Status Card
  statusContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  offlineCard: {
    backgroundColor: 'rgba(249, 115, 22, 0.05)',
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  offlineBadge: {
    backgroundColor: COLORS.offlineOrange,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  offlineBadgeText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  offlineTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.offlineOrange,
    marginBottom: 8,
  },
  offlineDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.secondaryText,
    fontWeight: '500',
  },
  onlineTextContainer: {
    marginLeft: 12,
  },
  onlineTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryText,
    marginBottom: 4,
  },
  onlineDesc: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },

  // Quick Buttons
  quickButtonsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryText,
    marginLeft: 8,
  },

  // Supported Payments
  supportedPayments: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  supportedLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondaryText,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  paymentChips: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondaryText,
    marginLeft: 6,
  }
});
