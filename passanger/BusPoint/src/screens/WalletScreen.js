import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Plus, RefreshCw } from 'lucide-react-native';
import { API_BASE_URL } from '../config/api';
import tw from 'twrnc';

export default function WalletScreen() {
  const { userToken } = useContext(AuthContext);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topupModalVisible, setTopupModalVisible] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/wallet/balance`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
      }
    } catch (error) {
      console.log('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleTopup = async () => {
    const amount = parseFloat(amountToAdd);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/wallet/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}` 
        },
        body: JSON.stringify({ amount })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setBalance(data.balance);
        setTopupModalVisible(false);
        setAmountToAdd('');
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Network request failed.');
    }
  };

  return (
    <View style={tw`flex-1 bg-slate-50 p-5`}>
      <View style={tw`flex-row justify-between items-center mt-10 mb-5`}>
        <Text style={tw`text-3xl font-bold text-slate-800`}>My Wallet</Text>
        <TouchableOpacity onPress={fetchBalance}>
          <RefreshCw color="#0D6EFD" size={24} />
        </TouchableOpacity>
      </View>

      <View style={tw`bg-[#0D6EFD] rounded-3xl p-6 shadow-lg shadow-blue-500/30`}>
        <View style={tw`flex-row items-center mb-7`}>
          <Wallet color="#FFFFFF" size={40} />
          <View style={tw`ml-4`}>
            <Text style={tw`text-white/80 text-sm mb-1`}>Current Balance</Text>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={tw`text-white text-3xl font-bold`}>₹{balance.toFixed(2)}</Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          style={tw`bg-white flex-row items-center justify-center py-3.5 rounded-2xl`}
          onPress={() => setTopupModalVisible(true)}
        >
          <Plus color="#0D6EFD" size={20} />
          <Text style={tw`text-[#0D6EFD] text-base font-bold ml-2`}>Top Up Wallet</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`mt-8 flex-1`}>
        <Text style={tw`text-lg font-bold text-slate-800 mb-4`}>Recent Activity</Text>
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-slate-500 text-base`}>No recent transactions.</Text>
        </View>
      </View>

      {/* Topup Modal */}
      <Modal
        visible={topupModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setTopupModalVisible(false)}
      >
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl p-6 pb-10`}>
            <Text style={tw`text-2xl font-bold text-slate-800 mb-2`}>Add Money</Text>
            <Text style={tw`text-slate-500 mb-5`}>Enter amount to top up your wallet</Text>
            
            <TextInput
              style={tw`bg-slate-50 h-14 rounded-xl px-4 text-lg text-slate-800 border border-slate-200 mb-6`}
              placeholder="Amount (e.g. 100)"
              keyboardType="numeric"
              value={amountToAdd}
              onChangeText={setAmountToAdd}
            />
            
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity 
                style={tw`flex-1 h-14 rounded-xl justify-center items-center bg-slate-100 mr-2`} 
                onPress={() => setTopupModalVisible(false)}
              >
                <Text style={tw`text-slate-600 text-base font-bold`}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={tw`flex-1 h-14 rounded-xl justify-center items-center bg-[#0D6EFD] ml-2`} 
                onPress={handleTopup}
              >
                <Text style={tw`text-white text-base font-bold`}>Add Funds</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
