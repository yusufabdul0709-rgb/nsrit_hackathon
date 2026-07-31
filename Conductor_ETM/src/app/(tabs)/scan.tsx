import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Icon from '../../components/Icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { useRouter } from 'expo-router';
import { Button } from '../../components/Button';

const { width } = Dimensions.get('window');

const XIcon = Icon.X || Icon.XSquare;
const ZapIcon = Icon.Zap || Icon.Flash;
const QrCodeIcon = Icon.QrCode || Icon.ScanQrCode;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    // In a real app, you'd process the ticket data here
    alert(`Ticket Scanned: ${data}`);
    setTimeout(() => setScanned(false), 2000);
  };

  if (!permission) {
    return <View style={styles.container} />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Overlay */}
      <SafeAreaView style={styles.overlay}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            {XIcon && <XIcon color="#FFF" size={24} />}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Ticket</Text>
          <TouchableOpacity style={styles.iconButton}>
            {ZapIcon && <ZapIcon color="#FFF" size={24} />}
          </TouchableOpacity>
        </View>

        {/* Scanner Target (Glassmorphism look) */}
        <View style={styles.scannerTargetContainer}>
          <View style={styles.scannerTarget}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <Text style={styles.scanInstruction}>Align QR code within the frame to verify ticket</Text>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomPanel}>
          <View style={styles.bottomIconContainer}>
            {QrCodeIcon && <QrCodeIcon color={Colors.primary} size={32} />}
          </View>
          <Text style={styles.bottomTitle}>Ready to scan</Text>
          <Text style={styles.bottomSubtitle}>Hold device steady</Text>
        </View>
      </SafeAreaView>
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
    backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay around scanner
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
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 24,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 24,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 24,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 24,
  },
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
  }
});
