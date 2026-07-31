import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
      console.log('Error reading offline ticket', e);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout(), style: 'destructive' }
    ]);
  };

  const handleViewOfflineTicket = () => {
    if (offlineTicket) {
      navigation.navigate('TicketQR', { ticket: offlineTicket });
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-slate-50`} contentContainerStyle={tw`p-5 pt-15 pb-25`}>
      <View style={tw`items-center mb-10`}>
        <View style={tw`w-20 h-20 rounded-full bg-[#0D6EFD] justify-center items-center mb-4 shadow-lg`}>
          <User color="#FFFFFF" size={40} />
        </View>
        <Text style={tw`text-2xl font-bold text-slate-800 mb-1`}>{userData?.name || 'Passenger'}</Text>
        <Text style={tw`text-base text-slate-500 mb-3`}>+91 {userData?.phone || 'XXXXXXXXXX'}</Text>
        <View style={tw`bg-blue-50 px-3 py-1 rounded-xl`}>
          <Text style={tw`text-xs font-bold text-[#0D6EFD]`}>{userData?.role || 'PASSENGER'}</Text>
        </View>
      </View>

      <View style={tw`mb-8`}>
        <Text style={tw`text-lg font-bold text-slate-800 mb-4`}>Offline Access</Text>
        
        <TouchableOpacity 
          style={tw`flex-row items-center bg-white p-4 rounded-2xl mb-3 border border-slate-200`} 
          onPress={handleViewOfflineTicket} 
          disabled={!offlineTicket}
        >
          <View style={tw`w-12 h-12 rounded-xl bg-emerald-50 justify-center items-center mr-4`}>
            <WifiOff color="#34A853" size={24} />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-semibold text-slate-800 mb-0.5`}>My Offline Ticket</Text>
            {offlineTicket ? (
              <Text style={tw`text-xs text-slate-500`}>Saved for no-internet access</Text>
            ) : (
              <Text style={tw`text-xs text-slate-500`}>No tickets cached</Text>
            )}
          </View>
          <ChevronRight color="#94A3B8" size={20} />
        </TouchableOpacity>
      </View>

      <View style={tw`mb-8`}>
        <Text style={tw`text-lg font-bold text-slate-800 mb-4`}>Account</Text>
        
        <TouchableOpacity style={tw`flex-row items-center bg-white p-4 rounded-2xl mb-3 border border-slate-200`}>
          <View style={tw`w-12 h-12 rounded-xl bg-blue-50 justify-center items-center mr-4`}>
            <FileText color="#0D6EFD" size={24} />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-semibold text-slate-800 mb-0.5`}>My Documents</Text>
            <Text style={tw`text-xs text-slate-500`}>ID cards & passes</Text>
          </View>
          <ChevronRight color="#94A3B8" size={20} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`flex-row items-center bg-white p-4 rounded-2xl mb-3 border border-slate-200`} 
          onPress={() => navigation.navigate('Feedback')}
        >
          <View style={tw`w-12 h-12 rounded-xl bg-amber-50 justify-center items-center mr-4`}>
            <Star color="#FFC107" size={24} />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-semibold text-slate-800 mb-0.5`}>Rate Your Journey</Text>
            <Text style={tw`text-xs text-slate-500`}>Provide cleanliness & driver feedback</Text>
          </View>
          <ChevronRight color="#94A3B8" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={tw`flex-row items-center bg-white p-4 rounded-2xl mb-3 border border-slate-200`}>
          <View style={tw`w-12 h-12 rounded-xl bg-blue-50 justify-center items-center mr-4`}>
            <Settings color="#0D6EFD" size={24} />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-base font-semibold text-slate-800 mb-0.5`}>Settings</Text>
            <Text style={tw`text-xs text-slate-500`}>Preferences & Security</Text>
          </View>
          <ChevronRight color="#94A3B8" size={20} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={tw`flex-row items-center justify-center bg-red-50 py-4 rounded-2xl mt-5`} onPress={handleLogout}>
        <LogOut color="#E74C3C" size={20} style={tw`mr-2`} />
        <Text style={tw`text-red-600 text-base font-bold`}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
