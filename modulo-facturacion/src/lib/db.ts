import Database from 'better-sqlite3';
import path from 'path';

// Construct the path to the database file in the project directory
const dbPath = path.resolve(process.cwd(), 'facturacion.db');

let db: Database.Database;

try {
  db = new Database(dbPath, { verbose: console.log });
  db.pragma('journal_mode = WAL');

  // Initialize the database schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS InvoiceRequest (
      id TEXT PRIMARY KEY,
      businessName TEXT NOT NULL,
      rfc TEXT NOT NULL,
      postalCode TEXT NOT NULL,
      taxRegime TEXT NOT NULL,
      cfdiUse TEXT NOT NULL,
      email TEXT NOT NULL,
      ticketNumber TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Pendiente',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
} catch (error) {
  console.error("Failed to initialize database", error);
}

export default db;
