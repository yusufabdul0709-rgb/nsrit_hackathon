import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

export const BASE_URL = `${API_BASE_URL}/api`;

export const api = {
  async get(endpoint) {
    const token = await AsyncStorage.getItem('passengerToken');
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },

  async post(endpoint, body) {
    const token = await AsyncStorage.getItem('passengerToken');
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
};
