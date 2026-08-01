import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import * as Icon from '../../components/Icons';


import { useRouter } from 'expo-router';
import { apiClient } from '../../services/apiClient';

const UserIcon = Icon.User;
const LockIcon = Icon.Lock;
const ArrowRightIcon = Icon.ArrowRight;

export default function LoginScreen({ onLogin }: { onLogin?: () => void }) {
  let router: any = null;
  try {
    router = useRouter();
  } catch (e) {}

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [conductorId, setConductorId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!conductorId || !password || (isSignUp && !name)) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isSignUp) {
        res = await apiClient.post('/auth/register', {
          name,
          phone: conductorId,
          password,
          role: 'conductor',
        });
      } else {
        res = await apiClient.post('/auth/login', {
          username: conductorId,
          password,
          role: 'conductor',
        });
      }

      if (res.success && res.token) {
        await AsyncStorage.setItem('userToken', res.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(res.user));
        if (onLogin) onLogin();
        if (router?.replace) router.replace('/');
      } else {
        Alert.alert(isSignUp ? 'Signup Failed' : 'Login Failed', res.message || 'Invalid conductor credentials');
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
            <Text style={styles.welcomeText}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
            <Text style={styles.instructionText}>{isSignUp ? 'Register as a new conductor.' : 'Please log in with your conductor credentials.'}</Text>

            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <View style={styles.inputContainer}>
                  {UserIcon && <UserIcon color={Colors.text.secondary} size={20} />}
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={Colors.text.light}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Conductor ID</Text>
              <View style={styles.inputContainer}>
                {UserIcon && <UserIcon color={Colors.text.secondary} size={20} />}
                <TextInput
                  style={styles.input}
                  placeholder="Enter your ID (e.g., 24568)"
                  placeholderTextColor={Colors.text.light}
                  value={conductorId}
                  onChangeText={setConductorId}
                  autoCapitalize="none"
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

            {!isSignUp && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={handleAuth} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>{isSignUp ? 'Sign Up' : 'Secure Login'}</Text>
                  {ArrowRightIcon && <ArrowRightIcon color="#FFFFFF" size={18} />}
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleText}>
                {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
              </Text>
            </TouchableOpacity>
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
  
  // Logo & Branding
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

  // Form
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
  toggleBtn: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
