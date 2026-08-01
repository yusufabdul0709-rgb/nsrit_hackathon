import AsyncStorage from '@react-native-async-storage/async-storage';

let SQLite: any = null;
try {
  SQLite = require('expo-sqlite');
} catch (e) {
  console.log('expo-sqlite not loaded, using AsyncStorage fallback');
}

let db: any = null;
const ASYNC_TRANSACTIONS_KEY = 'APSRTC_CONDUCTOR_OFFLINE_TXNS';

export const initDB = async () => {
  if (SQLite && SQLite.openDatabaseAsync) {
    try {
      if (db) return;
      db = await SQLite.openDatabaseAsync('apsrtc_conductor.db');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          transactionId TEXT UNIQUE,
          requestId TEXT,
          walletReference TEXT,
          amount REAL,
          journey TEXT,
          status TEXT,
          createdAt INTEGER
        );
      `);
      console.log('📦 SQLite Database initialized successfully.');
      return;
    } catch (e) {
      console.log('SQLite init failed, using AsyncStorage fallback:', e);
    }
  }
};

export const saveTransaction = async (data: {
  transactionId: string;
  requestId: string;
  walletReference: string;
  amount: number;
  journey: string;
  status: string;
  createdAt: number;
}) => {
  try {
    if (SQLite && SQLite.openDatabaseAsync) {
      if (!db) await initDB();
      if (db) {
        await db.runAsync(
          `INSERT OR REPLACE INTO transactions (transactionId, requestId, walletReference, amount, journey, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            data.transactionId,
            data.requestId,
            data.walletReference,
            data.amount,
            data.journey,
            data.status,
            data.createdAt
          ]
        );
        console.log(`💾 Saved transaction ${data.transactionId} to SQLite.`);
        return;
      }
    }
  } catch (e) {}

  // Fallback AsyncStorage save
  try {
    const existing = await AsyncStorage.getItem(ASYNC_TRANSACTIONS_KEY);
    const txns = existing ? JSON.parse(existing) : [];
    const index = txns.findIndex((t: any) => t.transactionId === data.transactionId);
    if (index >= 0) {
      txns[index] = data;
    } else {
      txns.push(data);
    }
    await AsyncStorage.setItem(ASYNC_TRANSACTIONS_KEY, JSON.stringify(txns));
  } catch (e) {
    console.log('AsyncStorage save fallback error:', e);
  }
};

export const getPendingTransactions = async () => {
  try {
    if (SQLite && SQLite.openDatabaseAsync) {
      if (!db) await initDB();
      if (db) {
        const result = await db.getAllAsync(
          `SELECT * FROM transactions WHERE status = ? ORDER BY createdAt DESC`,
          ['PENDING_SETTLEMENT']
        );
        return result;
      }
    }
  } catch (e) {}

  // Fallback AsyncStorage get
  try {
    const existing = await AsyncStorage.getItem(ASYNC_TRANSACTIONS_KEY);
    const txns = existing ? JSON.parse(existing) : [];
    return txns.filter((t: any) => t.status === 'PENDING_SETTLEMENT');
  } catch (e) {
    return [];
  }
};

export const updateTransactionStatus = async (transactionId: string, status: string) => {
  try {
    if (SQLite && SQLite.openDatabaseAsync) {
      if (!db) await initDB();
      if (db) {
        await db.runAsync(
          `UPDATE transactions SET status = ? WHERE transactionId = ?`,
          [status, transactionId]
        );
        return;
      }
    }
  } catch (e) {}

  // Fallback AsyncStorage update
  try {
    const existing = await AsyncStorage.getItem(ASYNC_TRANSACTIONS_KEY);
    if (existing) {
      const txns = JSON.parse(existing);
      const updated = txns.map((t: any) => t.transactionId === transactionId ? { ...t, status } : t);
      await AsyncStorage.setItem(ASYNC_TRANSACTIONS_KEY, JSON.stringify(updated));
    }
  } catch (e) {}
};
