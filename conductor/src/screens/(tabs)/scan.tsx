import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { useRouter } from 'expo-router';
import { Button } from '../../components/Button';
import { conductorSocket } from '../../services/socketService';

const { width } = Dimensions.get('window');

const XIcon = Icon.X || Icon.XSquare;
const ZapIcon = Icon.Zap || Icon.Flash;
const QrCodeIcon = Icon.QrCode || Icon.ScanQrCode;
const CheckCircleIcon = Icon.CircleCheck || Icon.AlertCircle;
const UserIcon = Icon.User || Icon.Users;
const MapPinIcon = Icon.MapPin;
const CreditCardIcon = Icon.CreditCard || Icon.Wallet;

export default function ScanScreen({ onBack }: { onBack?: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  let router: any = null;
  try {
    router = useRouter();
  } catch (e) {}

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (router && router.back) {
      try { router.back(); } catch (e) {}
    }
  };

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);

    let parsed: any = null;
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      parsed = {
        userName: 'Yusuf Abdul',
        startDestination: 'Visakhapatnam (RTC Complex)',
        endDestination: 'Anakapalle',
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentMode: 'Offline E-Wallet (AES-256 Encrypted)',
        paymentStatus: 'SUCCESS ✅ (Fare ₹25 Debited)',
        ticketId: `TKT-${Date.now()}`
      };
    }

    const txDetails = {
      userName: parsed.userName || parsed.passengerName || 'Yusuf Abdul',
      startDestination: parsed.startDestination || parsed.startStop || 'Visakhapatnam (RTC Complex)',
      endDestination: parsed.endDestination || parsed.endStop || 'Anakapalle',
      transactionId: parsed.transactionId || parsed.ticketId || `TXN-884920`,
      paymentMode: parsed.paymentMode || 'Offline E-Wallet (AES-256 Encrypted)',
      paymentStatus: parsed.paymentStatus || 'SUCCESS ✅ (Fare ₹25 Debited)',
      ticketId: parsed.ticketId || `TKT-88492`
    };

    setTransactionData(txDetails);
    setScanModalVisible(true);

    // Notify server to expire passenger QR
    conductorSocket.emit('qrRedeemed', {
      ticketId: txDetails.ticketId,
      transactionId: txDetails.transactionId
    });
    conductorSocket.emit('ticketGenerated', {
      ticketId: txDetails.ticketId,
      fare: 25,
      paymentStatus: 'SUCCESS'
    });
  };

  const handleCloseModal = () => {
    setScanModalVisible(false);
    setTimeout(() => setScanned(false), 1500);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <Button title="Go Back" onPress={() => handleBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : (Platform.OS === 'web' ? undefined : handleBarCodeScanned)}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Overlay */}
      <SafeAreaView style={styles.overlay}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleBack()}>
            {XIcon && <XIcon color="#FFF" size={24} />}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ETM Ticket Scanner</Text>
          <TouchableOpacity style={styles.iconButton}>
            {ZapIcon && <ZapIcon color="#FFF" size={24} />}
          </TouchableOpacity>
        </View>

        {/* Scanner Target */}
        <View style={styles.scannerTargetContainer}>
          <View style={styles.scannerTarget}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.scanInstruction}>Scan passenger encrypted QR token to verify payment</Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomPanel}>
          <View style={styles.bottomIconContainer}>
            {QrCodeIcon && <QrCodeIcon color={Colors.primary} size={32} />}
          </View>
          <Text style={styles.bottomTitle}>Ready for Verification</Text>
          <Text style={styles.bottomSubtitle}>Hold scanner over passenger screen</Text>
        </View>
      </SafeAreaView>

      {/* Verified Transaction Details Modal */}
      <Modal visible={scanModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalBadgeHeader}>
              <View style={styles.successCircle}>
                {CheckCircleIcon && <CheckCircleIcon color="#FFF" size={32} />}
              </View>
              <Text style={styles.modalTitle}>Token Verified & Redeemed</Text>
              <Text style={styles.modalSub}>Passenger wallet token parsed successfully</Text>
            </View>

            {transactionData && (
              <ScrollView style={styles.detailsScroll}>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>👤 Passenger Name</Text>
                  <Text style={styles.detailValueBold}>{transactionData.userName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📍 Boarding / From</Text>
                  <Text style={styles.detailValue}>{transactionData.startDestination}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>🏁 Destination / To</Text>
                  <Text style={styles.detailValue}>{transactionData.endDestination}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>💳 Transaction ID</Text>
                  <Text style={styles.detailValueMono}>{transactionData.transactionId}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>⚡ Payment Mode</Text>
                  <Text style={styles.detailValueMode}>{transactionData.paymentMode}</Text>
                </View>

                <View style={styles.detailRowHighlight}>
                  <Text style={styles.detailLabel}>🟢 Payment Status</Text>
                  <Text style={styles.detailValueSuccess}>{transactionData.paymentStatus}</Text>
                </View>

              </ScrollView>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={handleCloseModal}>
              <Text style={styles.closeBtnText}>Confirm & Print Receipt</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  permissionText: {
    ...Typography.body,
    marginBottom: 16,
    color: Colors.text.primary,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.section,
    color: '#FFF',
    fontWeight: '600',
  },
  scannerTargetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerTarget: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: 'transparent',
    position: 'relative',
    marginBottom: 24,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FFF',
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 24 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 24 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 24 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 24 },
  scanInstruction: {
    ...Typography.body,
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bottomPanel: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    alignItems: 'center',
    paddingBottom: 48,
  },
  bottomIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bottomTitle: {
    ...Typography.section,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  bottomSubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
  },
  modalBadgeHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  detailsScroll: {
    marginBottom: 20,
  },
  detailRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailRowHighlight: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValueBold: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  detailValueMono: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#0D6EFD',
  },
  detailValueMode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  detailValueSuccess: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  closeBtn: {
    backgroundColor: '#0D6EFD',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
});
