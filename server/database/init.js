const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'smartkeep.db');

let db;

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('📁 Connected to SQLite database');
      
      // Create notes table with schema matching the original OneNote.html
      const createNotesTable = `
        CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          content TEXT NOT NULL,
          category TEXT DEFAULT 'Work',
          pinned INTEGER DEFAULT 0,
          is_password INTEGER DEFAULT 0,
          archived INTEGER DEFAULT 0,
          CreatedDate TEXT DEFAULT CURRENT_TIMESTAMP,
          LastModifiedDate TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.run(createNotesTable, (err) => {
        if (err) {
          console.error('Error creating notes table:', err);
          reject(err);
          return;
        }
        console.log('✅ Notes table created/verified');
        
        // Create indexes for better performance
        const indexes = [
          'CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category)',
          'CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(pinned)',
          'CREATE INDEX IF NOT EXISTS idx_notes_archived ON notes(archived)',
          'CREATE INDEX IF NOT EXISTS idx_notes_created_date ON notes(CreatedDate)'
        ];
        
        let indexCount = 0;
        indexes.forEach((indexSQL) => {
          db.run(indexSQL, (err) => {
            if (err) {
              console.error('Error creating index:', err);
            }
            indexCount++;
            if (indexCount === indexes.length) {
              console.log('✅ Database indexes created/verified');
              resolve();
            }
          });
        });
      });
    });
  });
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

const closeDatabase = () => {
  return new Promise((resolve) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('📁 Database connection closed');
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeDatabase();
  process.exit(0);
});

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase
};
