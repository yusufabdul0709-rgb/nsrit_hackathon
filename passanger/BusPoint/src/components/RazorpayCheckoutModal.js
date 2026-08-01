import React from 'react';
import { View, Text, Modal, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { ArrowLeft, ShieldCheck, X } from 'lucide-react-native';
import tw from 'twrnc';

export default function RazorpayCheckoutModal({
  visible,
  orderId,
  amount,
  keyId = 'rzp_test_Rp7Q0snFBZKQb0',
  walletId = 'WAL-APSRTC-987654',
  userName = 'Valued Passenger',
  userPhone = '9876543210',
  onSuccess,
  onCancel,
  onError
}) {
  if (!visible) return null;

  const amountPaise = Math.round(Number(amount || 100) * 100);

  const razorpayHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #0F172A; display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #FFFFFF; }
    .card { background: #1E293B; padding: 24px; border-radius: 20px; border: 1px solid #334155; text-align: center; max-width: 90%; width: 340px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .logo { width: 60px; height: 60px; background: #0D6EFD; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 900; margin: 0 auto 16px auto; color: white; }
    h2 { font-size: 18px; font-weight: 800; margin-bottom: 4px; color: #F8FAFC; }
    p { font-size: 12px; color: #94A3B8; margin-bottom: 20px; }
    .amount { font-size: 32px; font-weight: 900; color: #38BDF8; margin-bottom: 24px; }
    .spinner { border: 3px solid rgba(255,255,255,0.1); border-left-color: #0D6EFD; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 12px auto; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .badge { display: inline-block; background: rgba(13,110,253,0.15); color: #60A5FA; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(13,110,253,0.3); }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">AP</div>
    <h2>APSRTC E-Wallet</h2>
    <p>Official Online Gateway • Razorpay Standard</p>
    <div class="amount">₹${Number(amount).toFixed(2)}</div>
    <div class="spinner"></div>
    <div class="badge">🔒 Razorpay Key: ${keyId.slice(0, 12)}...</div>
  </div>

  <script>
    var options = {
      "key": "${keyId}",
      "amount": "${amountPaise}",
      "currency": "INR",
      "name": "APSRTC Smart Transit",
      "description": "Top-up Wallet: ${walletId}",
      "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/APSRTC_Logo.svg/200px-APSRTC_Logo.svg.png",
      "order_id": "${orderId || ''}",
      "handler": function (response) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          status: 'SUCCESS',
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        }));
      },
      "modal": {
        "ondismiss": function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'CANCELLED' }));
        }
      },
      "prefill": {
        "name": "${userName}",
        "email": "passenger@apsrtc.gov.in",
        "contact": "${userPhone}"
      },
      "notes": {
        "walletId": "${walletId}",
        "platform": "APSRTC_Smart_Bus_App"
      },
      "theme": {
        "color": "#0D6EFD",
        "backdrop_color": "#0F172A"
      }
    };

    var rzp1 = new Razorpay(options);

    rzp1.on('payment.failed', function (response) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        status: 'FAILED',
        error: response.error.description || 'Payment Failed'
      }));
    });

    window.onload = function() {
      setTimeout(function() {
        rzp1.open();
      }, 300);
    };
  </script>
</body>
</html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.status === 'SUCCESS') {
        onSuccess(data);
      } else if (data.status === 'CANCELLED') {
        onCancel();
      } else if (data.status === 'FAILED') {
        onError(data.error || 'Payment Failed');
      }
    } catch (e) {
      console.log('Razorpay WebView Message Error:', e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <SafeAreaView style={tw`flex-1 bg-slate-900`}>
        {/* Header Bar */}
        <View style={tw`flex-row items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900`}>
          <TouchableOpacity onPress={onCancel} style={tw`p-2 -ml-2`}>
            <X color="#F8FAFC" size={24} />
          </TouchableOpacity>
          <View style={tw`items-center`}>
            <Text style={tw`text-white font-bold text-base`}>Razorpay Gateway</Text>
            <Text style={tw`text-[10px] text-blue-400 font-mono`}>{walletId}</Text>
          </View>
          <View style={tw`flex-row items-center bg-blue-500/20 px-2 py-1 rounded-full border border-blue-500/30`}>
            <ShieldCheck color="#60A5FA" size={12} />
            <Text style={tw`text-blue-400 text-[10px] font-bold ml-1`}>Test</Text>
          </View>
        </View>

        {/* Razorpay Standard Checkout WebView */}
        <WebView
          originWhitelist={['*']}
          source={{ html: razorpayHtml }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={tw`absolute inset-0 bg-slate-900 justify-center items-center`}>
              <ActivityIndicator size="large" color="#0D6EFD" />
              <Text style={tw`text-slate-400 text-xs font-semibold mt-3`}>Opening Official Razorpay Checkout...</Text>
            </View>
          )}
          style={tw`flex-1 bg-slate-900`}
        />
      </SafeAreaView>
    </Modal>
  );
}
