import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import * as Icon from '../../components/Icons';


const ArrowLeftIcon = Icon.ArrowLeft;
const CheckCircleIcon = Icon.CheckCircle;

export default function UpiPayScreen({ onBack }: { onBack?: () => void }) {

  const handleBack = () => {
    if (onBack) onBack();

  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          {ArrowLeftIcon && <ArrowLeftIcon color={Colors.text.primary} size={24} />}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UPI Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>₹135.00</Text>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrFrame}>
            {/* Mock QR Code visual */}
            <View style={styles.qrMock}>
              <View style={styles.qrCornerTopLeft} />
              <View style={styles.qrCornerTopRight} />
              <View style={styles.qrCornerBottomLeft} />
              <View style={styles.qrInnerData} />
            </View>
          </View>
          <Text style={styles.qrInstruction}>Ask passenger to scan the QR code from any UPI app (PhonePe, GPay, Paytm).</Text>
        </View>

        <TouchableOpacity style={styles.verifyBtn}>
          {CheckCircleIcon && <CheckCircleIcon color="#FFFFFF" size={20} />}
          <Text style={styles.verifyBtnText}>Verify Payment Status</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    ...Typography.caption,
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 40,
    width: '100%',
  },
  qrFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
  },
  qrMock: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
    position: 'relative',
  },
  qrCornerTopLeft: { position: 'absolute', top: 10, left: 10, width: 30, height: 30, backgroundColor: '#FFF' },
  qrCornerTopRight: { position: 'absolute', top: 10, right: 10, width: 30, height: 30, backgroundColor: '#FFF' },
  qrCornerBottomLeft: { position: 'absolute', bottom: 10, left: 10, width: 30, height: 30, backgroundColor: '#FFF' },
  qrInnerData: { position: 'absolute', top: 50, left: 50, width: 60, height: 60, backgroundColor: '#FFF' },
  
  qrInstruction: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.text.secondary,
    lineHeight: 22,
    fontSize: 14,
  },
  verifyBtn: {
    backgroundColor: '#059669', // Green for verify/success action
    borderRadius: 12,
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  verifyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
