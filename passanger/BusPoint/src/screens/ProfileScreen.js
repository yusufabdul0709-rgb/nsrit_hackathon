import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, FileText, Settings, WifiOff, ChevronRight, Star } from 'lucide-react-native';
import tw from 'twrnc';

export default function ProfileScreen({ navigation }) {
  const { userData, logout } = useContext(AuthContext);
  const [offlineTicket, setOfflineTicket] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      checkOfflineTicket();
    });
    return unsubscribe;
  }, [navigation]);

  const checkOfflineTicket = async () => {
    try {
      const stored = await AsyncStorage.getItem('latestOfflineTicket');
      if (stored) {
        setOfflineTicket(JSON.parse(stored));
      }
    } catch (e) {
      console.log('Error reading stored ticket:', e);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50 p-5`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={tw`mt-2 mb-6 flex-row items-center`}>
          <View style={tw`w-16 h-16 rounded-full bg-[#0D6EFD] justify-center items-center mr-4 shadow-md`}>
            <User color="#FFFFFF" size={32} />
          </View>
          <View>
            <Text style={tw`text-2xl font-bold text-slate-800`}>{userData?.name || 'Valued Passenger'}</Text>
            <Text style={tw`text-sm text-slate-500`}>{userData?.phone || '+91 9876543210'}</Text>
            <View style={tw`bg-blue-100 px-2 py-0.5 rounded-md self-start mt-1`}>
              <Text style={tw`text-[#0D6EFD] text-[10px] font-bold`}>APSRTC Regular Passenger</Text>
            </View>
          </View>
        </View>

        {/* Offline Saved Ticket Quick Access */}
        {offlineTicket && (
          <View style={tw`bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-200 shadow-sm`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <View style={tw`flex-row items-center`}>
                <WifiOff color="#059669" size={18} />
                <Text style={tw`text-emerald-800 text-sm font-bold ml-2`}>Stored Offline Ticket</Text>
              </View>
              <Text style={tw`text-xs text-emerald-600 font-mono`}>{offlineTicket.ticketId}</Text>
            </View>
            <Text style={tw`text-slate-700 text-xs mb-3`}>{offlineTicket.startStop} → {offlineTicket.endStop}</Text>

            <TouchableOpacity 
              style={tw`bg-emerald-600 py-2.5 rounded-xl items-center`}
              onPress={() => navigation.navigate('TicketQR', { ticket: offlineTicket })}
            >
              <Text style={tw`text-white text-xs font-bold`}>View Stored QR & Ticket</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={tw`bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-6`}>
          <TouchableOpacity style={tw`flex-row items-center justify-between py-3 border-b border-slate-100`} onPress={() => navigation.navigate('Journey')}>
            <View style={tw`flex-row items-center`}>
              <FileText color="#0D6EFD" size={20} />
              <Text style={tw`text-base font-semibold text-slate-700 ml-3`}>My Booked Tickets</Text>
            </View>
            <ChevronRight color="#94A3B8" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center justify-between py-3 border-b border-slate-100`} onPress={() => navigation.navigate('Wallet')}>
            <View style={tw`flex-row items-center`}>
              <Settings color="#0D6EFD" size={20} />
              <Text style={tw`text-base font-semibold text-slate-700 ml-3`}>Wallet & Payments</Text>
            </View>
            <ChevronRight color="#94A3B8" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={tw`flex-row items-center justify-between py-3`} onPress={() => navigation.navigate('Feedback')}>
            <View style={tw`flex-row items-center`}>
              <Star color="#0D6EFD" size={20} />
              <Text style={tw`text-base font-semibold text-slate-700 ml-3`}>Help & Support</Text>
            </View>
            <ChevronRight color="#94A3B8" size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={tw`bg-rose-50 flex-row items-center justify-center py-4 rounded-2xl border border-rose-100 mb-10`}
          onPress={handleLogout}
        >
          <LogOut color="#EF4444" size={20} />
          <Text style={tw`text-rose-500 font-bold text-base ml-2`}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
