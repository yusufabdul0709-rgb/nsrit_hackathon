import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';

const QUEUE_KEY = 'BUSONE_CONDUCTOR_OFFLINE_QUEUE';

export interface OfflineTransaction {
  localOfflineId: string;
  tripId: string;
  busNumber: string;
  passengerName?: string;
  currentStop: string;
  destinationStop: string;
  fare: number;
  distanceKm: number;
  paymentMode: 'OFFLINE_CASH_OR_UPI';
  status: 'PENDING_SYNC';
  timestamp: string;
}

export class OfflineQueueService {
  /**
   * Retrieves all pending transactions stored in local offline queue.
   */
  static async getQueue(): Promise<OfflineTransaction[]> {
    try {
      const data = await AsyncStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Saves a new offline transaction locally when network is unavailable.
   */
  static async saveOfflineTransaction(item: OfflineTransaction): Promise<void> {
    const queue = await this.getQueue();
    queue.push(item);
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  /**
   * Clears queue after successful synchronization.
   */
  static async clearQueue(): Promise<void> {
    await AsyncStorage.removeItem(QUEUE_KEY);
  }

  /**
   * Synchronizes local offline queue items with backend server when internet restores.
   */
  static async syncWithBackend(): Promise<{ success: boolean; syncedCount: number }> {
    const queue = await this.getQueue();
    if (queue.length === 0) {
      return { success: true, syncedCount: 0 };
    }

    try {
      const result = await apiClient.post('/payment/sync', { offlineItems: queue });
      if (result.success) {
        await this.clearQueue();
        return { success: true, syncedCount: result.result?.syncedCount || queue.length };
      }
    } catch (err) {
      console.warn('Sync failed, will retry when online connection stabilizes.', err);
    }
    return { success: false, syncedCount: 0 };
  }
}
