import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getHostIp = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.experienceUrl ||
    (Constants.manifest2 && Constants.manifest2.extra?.expoGo?.developer?.tool);

  if (hostUri && typeof hostUri === 'string') {
    const cleanUri = hostUri.replace('exp://', '').replace('http://', '');
    const ip = cleanUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return ip;
    }
  }
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
};

export const API_BASE_URL = `http://${getHostIp()}:5000`;
console.log('📡 BusPoint API target URL:', API_BASE_URL);
