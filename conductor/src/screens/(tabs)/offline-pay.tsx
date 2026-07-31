import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import * as Icon from '../../components/Icons';
import { useRouter } from 'expo-router';

const ArrowLeftIcon = Icon.ArrowLeft;
const ArrowRightIcon = Icon.ArrowRight;
const QrCodeIcon = Icon.QrCode;
const WifiOffIcon = Icon.WifiOff;
const SmartphoneIcon = Icon.Smartphone;
const NfcIcon = Icon.Nfc;

export default function OfflinePayScreen({ onBack, onNavigate }: { onBack?: () => void, onNavigate?: (screen: string) => void }) {
  let router: any = null;
  try {
    router = useRouter();
  } catch (e) {}

  const handleBack = () => {
    if (onBack) onBack();
    else if (router?.back) router.back();
  };

  const navigateTo = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    } else if (router?.push) {
      router.push(screen);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          {ArrowLeftIcon && <ArrowLeftIcon color={Colors.text.primary} size={24} />}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offline Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          {WifiOffIcon && <WifiOffIcon color={Colors.status.warning} size={28} />}
          <Text style={styles.bannerTitle}>Offline Mode Active</Text>
          <Text style={styles.bannerDesc}>
            Choose a method below to securely process the passenger's payment offline. It will sync automatically when the connection is restored.
          </Text>
        </View>

        <TouchableOpacity style={styles.optionCard} onPress={() => navigateTo('qr-generate')} activeOpacity={0.7}>
          <View style={styles.optionCardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0E7FF' }]}>
              {QrCodeIcon && <QrCodeIcon color={Colors.primary} size={32} />}
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>QR Generation</Text>
              <Text style={styles.optionDesc}>Generate an offline QR code for the passenger to scan and validate later.</Text>
            </View>
            <View style={styles.arrowContainer}>
              {ArrowRightIcon && <ArrowRightIcon color={Colors.text.light} size={20} />}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => navigateTo('nfc-pay')} activeOpacity={0.7}>
          <View style={styles.optionCardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
              {NfcIcon && <NfcIcon color="#059669" size={32} />}
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>NFC Tap-to-Pay</Text>
              <Text style={styles.optionDesc}>Tap the passenger's smart card or NFC-enabled device to process the ticket.</Text>
            </View>
            <View style={styles.arrowContainer}>
              {ArrowRightIcon && <ArrowRightIcon color={Colors.text.light} size={20} />}
            </View>
          </View>
        </TouchableOpacity>
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
  },
  banner: {
    backgroundColor: Colors.status.warningBg,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.status.warning + '40',
  },
  bannerTitle: {
    ...Typography.cardTitle,
    color: Colors.status.warning,
    marginTop: 12,
    marginBottom: 8,
  },
  bannerDesc: {
    ...Typography.caption,
    textAlign: 'center',
    color: '#92400E',
    lineHeight: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...Typography.cardTitle,
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  optionDesc: {
    ...Typography.caption,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  arrowContainer: {
    marginLeft: 8,
    opacity: 0.5,
  },
});
