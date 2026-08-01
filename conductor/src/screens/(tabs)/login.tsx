import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import * as Icon from '../../components/Icons';
import { useRouter } from 'expo-router';
import { apiClient } from '../../services/apiClient';

const UserIcon = Icon.User;
const LockIcon = Icon.Lock;
const ArrowRightIcon = Icon.ArrowRight;

export default function LoginScreen({ onLogin, onNavigateRegister }: { onLogin?: () => void, onNavigateRegister?: () => void }) {
  let router: any = null;
  try {
    router = useRouter();
  } catch (e) {}

  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!contact || !password) {
      Alert.alert('Error', 'Please enter your contact number and password');
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', {
        phone: contact,
        password,
        role: 'conductor',
      });

      if (res.success && res.token) {
        await AsyncStorage.setItem('userToken', res.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.user));
        if (onLogin) onLogin();
        if (router?.replace) router.replace('/');
      } else {
        Alert.alert('Login Failed', res.message || 'Invalid conductor credentials');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Failed to reach server. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>AP</Text>
            </View>
            <Text style={styles.brandTitle}>APSRTC</Text>
            <Text style={styles.brandSubtitle}>Conductor ETM Portal</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.instructionText}>Please log in with your conductor credentials.</Text>



            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact Number</Text>
              <View style={styles.inputContainer}>
                {UserIcon && <UserIcon color={Colors.text.secondary} size={20} />}
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor={Colors.text.light}
                  value={contact}
                  onChangeText={setContact}
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                {LockIcon && <LockIcon color={Colors.text.secondary} size={20} />}
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.text.light}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Secure Login</Text>
                  {ArrowRightIcon && <ArrowRightIcon color="#FFFFFF" size={18} />}
                </>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => {
                if (onNavigateRegister) onNavigateRegister();
                else router?.push('/register');
              }}>
                <Text style={styles.registerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
    marginTop: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    height: '100%',
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  }
});
