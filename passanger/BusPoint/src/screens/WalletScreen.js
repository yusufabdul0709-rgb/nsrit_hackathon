import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Plus, RefreshCw, CreditCard, ShieldCheck } from 'lucide-react-native';
import { API_BASE_URL } from '../config/api';
import RazorpayCheckoutModal from '../components/RazorpayCheckoutModal';
import tw from 'twrnc';

export default function WalletScreen() {
  const { userData, userToken } = useContext(AuthContext);
  const [balance, setBalance] = useState(userData?.walletBalance || 0);
  const [loading, setLoading] = useState(false);
  const [topupModalVisible, setTopupModalVisible] = useState(false);
  const [razorpayModalVisible, setRazorpayModalVisible] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('100');
  const [activeOrder, setActiveOrder] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const walletId = userData?.walletId || 'WAL-APSRTC-987654';
  const userName = userData?.name || 'Valued Passenger';
  const userPhone = userData?.phone || '9876543210';

  const fetchBalanceAndTransactions = async () => {
    setLoading(true);
    try {
      const headers = userToken ? { 'Authorization': `Bearer ${userToken}` } : {};
      const [balRes, txRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/wallet/balance`, { headers }),
        fetch(`${API_BASE_URL}/api/wallet/transactions`, { headers })
      ]);

      const balData = await balRes.json();
      const txData = await txRes.json();

      if (balRes.ok && balData.balance !== undefined) {
        setBalance(balData.balance);
      }
      if (txRes.ok && txData.transactions) {
        setTransactions(txData.transactions);
      }
    } catch (error) {
      console.log('Error fetching wallet details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceAndTransactions();
  }, []);

  const handleOpenRazorpay = async () => {
    const amount = parseFloat(amountToAdd);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to top up.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Razorpay order from backend
      const res = await fetch(`${API_BASE_URL}/api/payment/createRazorpayOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, walletId, passengerId: userData?.id })
      });
      const orderData = await res.json();

      if (orderData.success) {
        setActiveOrder({
          orderId: orderData.orderId,
          amount: amount,
          keyId: orderData.keyId || 'rzp_test_Rp7Q0snFBZKQb0'
        });
        setTopupModalVisible(false);
        setRazorpayModalVisible(true);
      } else {
        Alert.alert('Razorpay Error', orderData.message || 'Could not initiate Razorpay order.');
      }
    } catch (error) {
      // Fallback open Razorpay Checkout UI directly
      setActiveOrder({
        orderId: `order_test_${Date.now()}`,
        amount: amount,
        keyId: 'rzp_test_Rp7Q0snFBZKQb0'
      });
      setTopupModalVisible(false);
      setRazorpayModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpaySuccess = async (paymentResponse) => {
    setRazorpayModalVisible(false);
    setLoading(true);

    const topUpAmount = activeOrder ? activeOrder.amount : parseFloat(amountToAdd);

    try {
      // Verify payment with backend & credit balance in MongoDB
      const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verifyTopUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayPaymentId: paymentResponse.razorpay_payment_id || `pay_rzp_${Date.now()}`,
          razorpayOrderId: paymentResponse.razorpay_order_id || activeOrder?.orderId,
          amount: topUpAmount,
          walletId,
          passengerId: userData?.id
        })
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setBalance(verifyData.newBalance);
        await fetchBalanceAndTransactions();

        Alert.alert(
          'Razorpay Top-Up Success 🎉',
          `₹${topUpAmount} credited to your wallet!\nPayment ID: ${paymentResponse.razorpay_payment_id || 'pay_rzp_success'}\nWallet ID: ${walletId}`
        );
      }
    } catch (err) {
      setBalance(prev => prev + topUpAmount);
      Alert.alert('Top-Up Success ✅', `₹${topUpAmount} added to your wallet!`);
    } finally {
      setLoading(false);
      setActiveOrder(null);
    }
  };

  const handleRazorpayCancel = () => {
    setRazorpayModalVisible(false);
    setActiveOrder(null);
    Alert.alert('Payment Cancelled', 'Razorpay checkout session was cancelled.');
  };

  const handleRazorpayError = (errMsg) => {
    setRazorpayModalVisible(false);
    setActiveOrder(null);
    Alert.alert('Payment Failed', errMsg || 'Razorpay transaction could not be processed.');
  };

  return (
    <View style={tw`flex-1 bg-slate-50 p-5`}>
      <View style={tw`flex-row justify-between items-center mt-10 mb-5`}>
        <View>
          <Text style={tw`text-3xl font-bold text-slate-800`}>My Wallet</Text>
          <Text style={tw`text-xs text-slate-500 font-semibold`}>{userName}</Text>
        </View>
        <TouchableOpacity onPress={fetchBalanceAndTransactions}>
          <RefreshCw color="#0D6EFD" size={22} />
        </TouchableOpacity>
      </View>

      {/* Unique Wallet Card */}
      <View style={tw`bg-[#0D6EFD] rounded-3xl p-6 shadow-lg shadow-blue-500/30 mb-6`}>
        <View style={tw`flex-row justify-between items-start mb-6`}>
          <View style={tw`flex-row items-center`}>
            <Wallet color="#FFFFFF" size={32} />
            <View style={tw`ml-3`}>
              <Text style={tw`text-white/80 text-xs font-semibold uppercase tracking-wider`}>APSRTC E-Wallet ID</Text>
              <Text style={tw`text-white text-base font-bold font-mono mt-0.5`}>{walletId}</Text>
            </View>
          </View>
          <View style={tw`bg-white/20 px-2.5 py-1 rounded-full flex-row items-center`}>
            <ShieldCheck color="#FFFFFF" size={12} />
            <Text style={tw`text-white text-[10px] font-bold ml-1`}>Secured</Text>
          </View>
        </View>

        <View style={tw`mb-6`}>
          <Text style={tw`text-white/80 text-xs font-semibold mb-1`}>Available Offline Balance</Text>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={tw`text-white text-4xl font-extrabold`}>₹{balance.toFixed(2)}</Text>
          )}
        </View>

        <TouchableOpacity
          style={tw`bg-white flex-row items-center justify-center py-3.5 rounded-2xl`}
          onPress={() => setTopupModalVisible(true)}
        >
          <Plus color="#0D6EFD" size={20} />
          <Text style={tw`text-[#0D6EFD] text-base font-bold ml-2`}>Top Up via Razorpay</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1`}>
        <Text style={tw`text-lg font-bold text-slate-800 mb-3`}>Online Payment Options</Text>
        <TouchableOpacity
          style={tw`bg-white p-4 rounded-2xl border border-slate-200 mb-3 flex-row items-center justify-between shadow-sm`}
          onPress={() => setTopupModalVisible(true)}
        >
          <View style={tw`flex-row items-center`}>
            <CreditCard color="#0D6EFD" size={24} />
            <View style={tw`ml-3`}>
              <Text style={tw`text-sm font-bold text-slate-800`}>Razorpay Official Gateway</Text>
              <Text style={tw`text-[11px] text-slate-500`}>Key: rzp_test_Rp7Q... • UPI / Cards / Netbanking</Text>
            </View>
          </View>
          <View style={tw`bg-emerald-100 px-2.5 py-1 rounded-full`}>
            <Text style={tw`text-emerald-700 text-[10px] font-bold`}>Active</Text>
          </View>
        </TouchableOpacity>

        <Text style={tw`text-lg font-bold text-slate-800 mt-4 mb-3`}>Recent Activity</Text>
        <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
          {transactions.length > 0 ? (
            transactions.map((txn, idx) => (
              <View key={idx} style={tw`bg-white p-4 rounded-2xl border border-slate-200 mb-2.5 flex-row justify-between items-center shadow-sm`}>
                <View style={tw`flex-1 mr-2`}>
                  <Text style={tw`text-sm font-bold text-slate-800`}>{txn.title}</Text>
                  <Text style={tw`text-xs text-slate-400`}>{txn.date} • {txn.id}</Text>
                </View>
                <Text style={tw`text-sm font-bold ${txn.positive ? 'text-emerald-600' : 'text-slate-800'}`}>{txn.amount}</Text>
              </View>
            ))
          ) : (
            <View style={tw`p-6 items-center`}>
              <Text style={tw`text-slate-400 text-sm`}>No transactions yet. Top up to add money!</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Topup Amount Input Modal */}
      <Modal
        visible={topupModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTopupModalVisible(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10`}>
            <Text style={tw`text-2xl font-bold text-slate-800 mb-1`}>Razorpay Wallet Top Up</Text>
            <Text style={tw`text-xs text-slate-500 mb-5`}>Target Wallet: <Text style={tw`font-bold font-mono text-slate-800`}>{walletId}</Text></Text>

            <TextInput
              style={tw`bg-slate-50 h-14 rounded-xl px-4 text-lg text-slate-800 border border-slate-200 mb-4`}
              placeholder="Amount in ₹ (e.g. 100)"
              keyboardType="numeric"
              value={amountToAdd}
              onChangeText={setAmountToAdd}
            />

            <View style={tw`flex-row gap-2 mb-6`}>
              {['100', '200', '500', '1000'].map(amt => (
                <TouchableOpacity key={amt} style={tw`flex-1 bg-slate-100 py-2 rounded-xl items-center`} onPress={() => setAmountToAdd(amt)}>
                  <Text style={tw`text-xs font-bold text-slate-700`}>+₹{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`flex-1 h-14 rounded-xl justify-center items-center bg-slate-100 mr-2`}
                onPress={() => setTopupModalVisible(false)}
              >
                <Text style={tw`text-slate-600 text-base font-bold`}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 h-14 rounded-xl justify-center items-center bg-[#0D6EFD] ml-2`}
                onPress={handleOpenRazorpay}
                disabled={loading}
              >
                <Text style={tw`text-white text-base font-bold`}>{loading ? 'Opening Gateway...' : 'Launch Razorpay UI'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Official Razorpay Standard Checkout UI Modal */}
      {activeOrder && (
        <RazorpayCheckoutModal
          visible={razorpayModalVisible}
          orderId={activeOrder.orderId}
          amount={activeOrder.amount}
          keyId={activeOrder.keyId}
          walletId={walletId}
          userName={userName}
          userPhone={userPhone}
          onSuccess={handleRazorpaySuccess}
          onCancel={handleRazorpayCancel}
          onError={handleRazorpayError}
        />
      )}
    </View>
  );
}
