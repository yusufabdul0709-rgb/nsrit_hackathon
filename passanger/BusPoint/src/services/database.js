import * as SQLite from 'expo-sqlite';

let db = null;

export const initDB = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('passenger_wallet.db');
  
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS wallet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      balance REAL NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      journey TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );
  `);

  // Initialize wallet if empty (give 500 starting balance for prototype)
  const result = await db.getAllAsync('SELECT * FROM wallet');
  if (result.length === 0) {
    await db.runAsync('INSERT INTO wallet (balance) VALUES (?)', [500.0]);
  }

  return db;
};

export const getWalletBalance = async () => {
  const database = await initDB();
  const row = await database.getFirstAsync('SELECT balance FROM wallet WHERE id = 1');
  return row ? row.balance : 0;
};

/**
 * Deduct amount and log transaction. Throws if insufficient funds.
 */
export const processOfflinePayment = async (amount, journey, transactionId) => {
  const database = await initDB();
  
  // Begin transaction (using atomic transaction helper)
  await database.withTransactionAsync(async () => {
    const row = await database.getFirstAsync('SELECT balance FROM wallet WHERE id = 1');
    const currentBalance = row ? row.balance : 0;
    
    if (currentBalance < amount) {
      throw new Error('Insufficient Funds');
    }
    
    const newBalance = currentBalance - amount;
    
    await database.runAsync('UPDATE wallet SET balance = ? WHERE id = 1', [newBalance]);
    
    await database.runAsync(
      'INSERT INTO transactions (id, amount, journey, status, createdAt) VALUES (?, ?, ?, ?, ?)',
      [transactionId, amount, journey, 'PENDING_SYNC', Date.now()]
    );
  });
  
  return true;
};
