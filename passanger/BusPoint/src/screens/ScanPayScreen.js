import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import QRCode from 'react-native-qrcode-svg';
import tw from 'twrnc';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react-native';

import { verifyPaymentRequest, generatePassengerToken } from '../services/cryptoService';
import { processOfflinePayment, getWalletBalance } from '../services/database';

export default function ScanPayScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  
  const [step, setStep] = useState('SCANNING'); // 'SCANNING' | 'PROCESSING' | 'SHOW_QR' | 'DONE'
  const [responseToken, setResponseToken] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    // If we transition to DONE, we can auto-navigate back after a few seconds
    if (step === 'DONE') {
      const timer = setTimeout(() => {
        navigation.navigate('Wallet');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step, navigation]);

  if (!permission) {
    return <View style={tw`flex-1 justify-center items-center`}><ActivityIndicator size="large" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={tw`flex-1 justify-center items-center p-5`}>
        <Text style={tw`text-lg text-center mb-5`}>We need your permission to show the camera</Text>
        <TouchableOpacity style={tw`bg-blue-500 px-5 py-3 rounded-xl`} onPress={requestPermission}>
          <Text style={tw`text-white font-bold`}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    setScanned(true);
    setStep('PROCESSING');

    // 1. Verify Conductor's QR Signature
    const verification = verifyPaymentRequest(data);
    
    if (!verification.success) {
      Alert.alert('Invalid QR', verification.error, [
        { text: 'Try Again', onPress: () => { setScanned(false); setStep('SCANNING'); } }
      ]);
      return;
    }

    const request = verification.request;
    setPaymentInfo(request);

    // 2. Process Offline Payment in local SQLite Wallet
    try {
      const txId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
      await processOfflinePayment(request.amount, request.journey, txId);
      
      // 3. Generate passenger response token
      const tokenString = generatePassengerToken({ ...request, transactionId: txId });
      setResponseToken(tokenString);
      setStep('SHOW_QR');
      
    } catch (err) {
      if (err.message === 'Insufficient Funds') {
        Alert.alert(
          'Insufficient Funds', 
          `Your offline wallet balance is too low to pay ₹${request.amount}. Please recharge your wallet online.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Payment Failed', err.message, [
          { text: 'Try Again', onPress: () => { setScanned(false); setStep('SCANNING'); } }
        ]);
      }
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0A0E1A]`}>
      <View style={tw`flex-row items-center p-4 border-b border-slate-800 bg-[#141825]`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <ArrowLeft color="#F1F5F9" size={24} />
        </TouchableOpacity>
        <Text style={tw`text-white text-lg font-bold ml-2`}>Offline Payment</Text>
      </View>

      {step === 'SCANNING' && (
        <View style={tw`flex-1`}>
          <CameraView
            style={tw`flex-1`}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          />
          <View style={tw`absolute bottom-0 w-full p-6 bg-[#0A0E1A] bg-opacity-90 items-center`}>
            <Text style={tw`text-white text-center text-base mb-2`}>
              Scan the QR code on the Conductor's device to pay offline securely.
            </Text>
          </View>
        </View>
      )}

      {step === 'PROCESSING' && (
        <View style={tw`flex-1 justify-center items-center bg-[#0A0E1A]`}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={tw`text-white mt-4 text-lg`}>Securing Transaction...</Text>
        </View>
      )}

      {step === 'SHOW_QR' && responseToken && paymentInfo && (
        <View style={tw`flex-1 justify-center items-center bg-[#0A0E1A] p-6`}>
          <View style={tw`bg-white rounded-3xl p-8 items-center w-full shadow-lg`}>
            <View style={tw`flex-row items-center mb-6 bg-emerald-100 px-4 py-2 rounded-full`}>
              <ShieldCheck color="#059669" size={20} />
              <Text style={tw`text-emerald-700 font-bold ml-2 text-sm`}>Wallet Deducted Offline</Text>
            </View>
            
            <Text style={tw`text-3xl font-bold text-slate-900 mb-2`}>₹{paymentInfo.amount}</Text>
            <Text style={tw`text-slate-500 mb-8`}>{paymentInfo.journey}</Text>

            <View style={tw`border-4 border-emerald-500 rounded-2xl p-2 mb-8`}>
              <QRCode
                value={responseToken}
                size={220}
                color="black"
                backgroundColor="white"
              />
            </View>
            
            <Text style={tw`text-slate-600 text-center text-sm mb-6`}>
              Show this QR code to the conductor. It contains your secure authorization.
            </Text>

            <TouchableOpacity 
              style={tw`bg-blue-600 w-full py-4 rounded-xl items-center`}
              onPress={() => setStep('DONE')}
            >
              <Text style={tw`text-white font-bold text-lg`}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'DONE' && (
        <View style={tw`flex-1 justify-center items-center bg-[#0A0E1A] p-6`}>
          <CheckCircle2 color="#34D399" size={80} style={tw`mb-6`} />
          <Text style={tw`text-3xl font-bold text-white mb-2`}>Payment Authorized</Text>
          <Text style={tw`text-slate-400 text-center text-base mb-8`}>
            Your encrypted wallet token details have been securely transferred. 
            Balance deducted locally.
          </Text>
          <TouchableOpacity 
            style={tw`bg-slate-800 border border-slate-700 w-full py-4 rounded-xl items-center`}
            onPress={() => navigation.navigate('Wallet')}
          >
            <Text style={tw`text-white font-bold text-lg`}>Return to Wallet</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
