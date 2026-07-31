import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
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
  console.log('📦 Database initialized successfully.');
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
  if (!db) await initDB();
  
  await db!.runAsync(
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
};

export const getPendingTransactions = async () => {
  if (!db) await initDB();
  
  // Use parameterized query to fetch only pending transactions
  const result = await db!.getAllAsync(
    `SELECT * FROM transactions WHERE status = ? ORDER BY createdAt DESC`,
    ['PENDING_SETTLEMENT']
  );
  return result;
};

export const updateTransactionStatus = async (transactionId: string, status: string) => {
  if (!db) await initDB();
  
  await db!.runAsync(
    `UPDATE transactions SET status = ? WHERE transactionId = ?`,
    [status, transactionId]
  );
};
