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
  NativeModules,
  NativeEventEmitter
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { 
  ArrowLeft, 
  Flashlight, 
  HelpCircle, 
  Wifi, 
  WifiOff, 
  CheckCircle2,
  XCircle,
  Clock,
  User
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
  success: '#16C47F',
  error: '#F04438',
  offlineOrange: '#F97316',
};

export default function ScanPassenger({ onBack }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isOffline, setIsOffline] = useState(false);
  const [scanResult, setScanResult] = useState(null); // 'valid' | 'invalid' | null
  
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start NFC Reader
    if (NativeModules.OfflinePaymentModule) {
      const { OfflinePaymentModule } = NativeModules;
      const emitter = new NativeEventEmitter(OfflinePaymentModule);

      OfflinePaymentModule.startReaderMode();

      const successListener = emitter.addListener('onPaymentSuccess', (event) => {
        setScanResult('valid');
        console.log('NFC Offline Payment Success:', event);
        setTimeout(() => setScanResult(null), 4000);
      });

      const errorListener = emitter.addListener('onNfcError', (error) => {
        setScanResult('invalid');
        console.log('NFC Error:', error);
        setTimeout(() => setScanResult(null), 4000);
      });

      return () => {
        OfflinePaymentModule.stopReaderMode();
        successListener.remove();
        errorListener.remove();
      };
    }
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 240,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Random network status for hackathon demo
    const interval = setInterval(() => {
      setIsOffline(prev => !prev);
    }, 8000);
    return () => clearInterval(interval);
  }, [scanLineAnim]);

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanResult) return; // Prevent multiple scans at once
    
    // Simulate validation
    const isValid = Math.random() > 0.3; // 70% chance valid for demo
    setScanResult(isValid ? 'valid' : 'invalid');
    
    // Reset after 3 seconds
    setTimeout(() => {
      setScanResult(null);
    }, 3000);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need camera access to scan Passenger Tickets.</Text>
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

      <View style={styles.scannerContainer}>
        <View style={styles.scannerFrame}>
          <CameraView 
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={handleBarcodeScanned}
          />
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          
          <Animated.View 
            style={[
              styles.scanLine, 
              { transform: [{ translateY: scanLineAnim }] }
            ]} 
          />
        </View>
        <Text style={styles.instructionText}>
          Scan passenger's QR Code or E-Ticket
        </Text>
      </View>

      <View style={styles.statusContainer}>
        {scanResult === 'valid' && (
          <View style={[styles.statusCard, styles.validCard]}>
            <CheckCircle2 color={COLORS.success} size={32} />
            <View style={styles.resultTextContainer}>
              <Text style={styles.validTitle}>Ticket Validated</Text>
              <Text style={styles.resultDesc}>Adult • Cyber City • ₹40</Text>
            </View>
          </View>
        )}
        
        {scanResult === 'invalid' && (
          <View style={[styles.statusCard, styles.invalidCard]}>
            <XCircle color={COLORS.error} size={32} />
            <View style={styles.resultTextContainer}>
              <Text style={styles.invalidTitle}>Invalid Ticket</Text>
              <Text style={styles.resultDesc}>Ticket already used or expired.</Text>
            </View>
          </View>
        )}

        {!scanResult && isOffline && (
          <View style={[styles.statusCard, styles.offlineCard]}>
            <View style={styles.statusHeader}>
              <WifiOff color={COLORS.offlineOrange} size={24} />
              <View style={styles.offlineBadge}>
                <Text style={styles.offlineBadgeText}>OFFLINE MODE</Text>
              </View>
            </View>
            <Text style={styles.offlineTitle}>Offline Sync Active</Text>
            <Text style={styles.offlineDesc}>
              Scanning locally. Tickets will be synchronized when connection restores.
            </Text>
          </View>
        )}

        {!scanResult && !isOffline && (
          <View style={styles.statusCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Wifi color={COLORS.success} size={24} />
              <View style={styles.resultTextContainer}>
                <Text style={styles.onlineTitle}>System Online</Text>
                <Text style={styles.resultDesc}>Ready to scan next passenger.</Text>
              </View>
            </View>
          </View>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  quickBtn: {
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryText,
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
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 28 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 28 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 28 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 28 },
  scanLine: {
    width: '100%',
    height: 3,
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
  validCard: {
    backgroundColor: 'rgba(22, 196, 127, 0.05)',
    borderColor: 'rgba(22, 196, 127, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  invalidCard: {
    backgroundColor: 'rgba(240, 68, 56, 0.05)',
    borderColor: 'rgba(240, 68, 56, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
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
  offlineBadgeText: { color: COLORS.surface, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  offlineTitle: { fontSize: 18, fontWeight: '700', color: COLORS.offlineOrange, marginBottom: 8 },
  offlineDesc: { fontSize: 14, lineHeight: 20, color: COLORS.secondaryText, fontWeight: '500' },
  
  resultTextContainer: { marginLeft: 16 },
  onlineTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primaryText, marginBottom: 4 },
  validTitle: { fontSize: 18, fontWeight: '700', color: COLORS.success, marginBottom: 4 },
  invalidTitle: { fontSize: 18, fontWeight: '700', color: COLORS.error, marginBottom: 4 },
  resultDesc: { fontSize: 14, color: COLORS.secondaryText, fontWeight: '500' },
});
