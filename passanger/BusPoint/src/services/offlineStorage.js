import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

const PASSENGER_TICKETS_KEY = 'BUSONE_PASSENGER_ACTIVE_TICKETS';

export class PassengerOfflineStorage {
  static async getSavedTickets() {
    try {
      const data = await AsyncStorage.getItem(PASSENGER_TICKETS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static async saveTicket(ticketObj) {
    const tickets = await this.getSavedTickets();
    tickets.unshift(ticketObj);
    await AsyncStorage.setItem(PASSENGER_TICKETS_KEY, JSON.stringify(tickets));
  }

  static async syncOfflineTickets() {
    const tickets = await this.getSavedTickets();
    const pendingTickets = tickets.filter((t) => t.paymentStatus === 'PENDING_SYNC');
    if (pendingTickets.length === 0) return;

    try {
      const res = await api.post('/payment/sync', { offlineItems: pendingTickets });
      if (res.success) {
        const updated = tickets.map((t) => {
          if (t.paymentStatus === 'PENDING_SYNC') {
            return { ...t, paymentStatus: 'SUCCESS', status: 'ACTIVE' };
          }
          return t;
        });
        await AsyncStorage.setItem(PASSENGER_TICKETS_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Passenger offline sync pending network reconnection');
    }
  }
}
