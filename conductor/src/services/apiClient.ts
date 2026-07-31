import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getHostIp = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    (Constants as any).experienceUrl ||
    (Constants as any).manifest2?.extra?.expoGo?.developer?.tool;

  if (hostUri && typeof hostUri === 'string') {
    const cleanUri = hostUri.replace('exp://', '').replace('http://', '');
    const ip = cleanUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

export const SERVER_HOST = getHostIp();
export const BASE_URL = `http://${SERVER_HOST}:5000/api`;
console.log('📡 Conductor API target URL:', BASE_URL);

export const apiClient = {
  async get(endpoint: string) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },

  async post(endpoint: string, body: any) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  },

  async patch(endpoint: string, body: any) {
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(body),
    });
    return response.json();
  },
};
