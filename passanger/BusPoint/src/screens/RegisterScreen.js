import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';
import tw from 'twrnc';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!phone || !password || !name) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data.token, data.user);
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-slate-50`}
    >
      <ScrollView contentContainerStyle={tw`flex-grow p-5 justify-center`} showsVerticalScrollIndicator={false}>
        <View style={tw`mb-10 mt-5`}>
          <Text style={tw`text-3xl font-bold text-slate-800 mb-2.5`}>Create Account</Text>
          <Text style={tw`text-base text-slate-500`}>Join APSRTC Smart Bus today</Text>
        </View>

        <View style={tw`bg-white p-6 rounded-3xl shadow-sm border border-slate-100`}>
          <View style={tw`mb-5`}>
            <Text style={tw`text-sm text-slate-500 mb-2 font-semibold`}>Full Name</Text>
            <TextInput 
              style={tw`bg-slate-50 h-14 rounded-xl px-4 text-base text-slate-800 border border-slate-200`}
              placeholder="Enter your full name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={tw`mb-5`}>
            <Text style={tw`text-sm text-slate-500 mb-2 font-semibold`}>Phone Number</Text>
            <TextInput 
              style={tw`bg-slate-50 h-14 rounded-xl px-4 text-base text-slate-800 border border-slate-200`}
              placeholder="Enter your phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={tw`mb-5`}>
            <Text style={tw`text-sm text-slate-500 mb-2 font-semibold`}>Password</Text>
            <TextInput 
              style={tw`bg-slate-50 h-14 rounded-xl px-4 text-base text-slate-800 border border-slate-200`}
              placeholder="Create a strong password"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={tw`bg-[#0D6EFD] h-14 rounded-2xl justify-center items-center mt-2.5`}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={tw`text-white text-base font-bold`}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <View style={tw`flex-row justify-center mt-5`}>
            <Text style={tw`text-slate-500 text-sm`}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={tw`text-[#0D6EFD] text-sm font-bold`}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
