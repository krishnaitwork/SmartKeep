const express = require('express');
const { getDatabase } = require('../database/init');

const router = express.Router();

// Get all categories - MUST come before /:id route
router.get('/categories', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT DISTINCT category FROM notes WHERE category IS NOT NULL ORDER BY category', [], (err, rows) => {
    if (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to fetch categories' });
      return;
    }
    
    const categories = rows.map(row => row.category);
    // Include default categories
    const defaultCategories = ['Work', 'Personal', 'Home', 'Finance'];
    const allCategories = [...new Set([...defaultCategories, ...categories])];
    
    res.json(allCategories);
  });
});

// Export database - MUST come before /:id route
router.get('/export', (req, res) => {
  const db = getDatabase();
  
  db.all('SELECT * FROM notes ORDER BY CreatedDate DESC', [], (err, rows) => {
    if (err) {
      console.error('Error exporting database:', err);
      res.status(500).json({ error: 'Failed to export database' });
      return;
    }
    
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      notes: rows
    };
    
    res.setHeader('Content-Disposition', 'attachment; filename=smartkeep-export.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(exportData);
  });
});

// Import database
router.post('/import', (req, res) => {
  const db = getDatabase();
  const { notes } = req.body;
  
  if (!Array.isArray(notes)) {
    res.status(400).json({ error: 'Invalid import data format' });
    return;
  }
  
  // Begin transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    let imported = 0;
    let errors = 0;
    
    const insertPromises = notes.map((note) => {
      return new Promise((resolve) => {
        const { title, content, category, pinned, archived, is_password, CreatedDate } = note;
        const now = new Date().toISOString();
        
        const sql = `
          INSERT INTO notes (title, content, category, pinned, archived, is_password, CreatedDate, LastModifiedDate)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(sql, [
          title || null,
          content || '',
          category || 'Work',
          pinned || 0,
          archived || 0,
          is_password || 0,
          CreatedDate || now,
          now
        ], function(err) {
          if (err) {
            console.error('Error importing note:', err);
            errors++;
          } else {
            imported++;
          }
          resolve();
        });
      });
    });
    
    Promise.all(insertPromises).then(() => {
      if (errors > 0) {
        db.run('ROLLBACK');
        res.status(500).json({ 
          error: 'Import failed', 
          details: `${errors} notes failed to import` 
        });
      } else {
        db.run('COMMIT');
        res.json({ 
          message: 'Import successful', 
          imported: imported 
        });
      }
    });
  });
});

// Get all notes with filtering options
router.get('/', (req, res) => {
  const db = getDatabase();
  const { search, category, archived, pinned } = req.query;
  
  let sql = 'SELECT * FROM notes WHERE 1=1';
  let params = [];
  
  // Apply filters
  if (search) {
    sql += ' AND (title LIKE ? OR content LIKE ? OR category LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }
  
  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }
  
  if (archived !== undefined) {
    sql += ' AND archived = ?';
    params.push(archived === 'true' ? 1 : 0);
  }
  
  if (pinned !== undefined) {
    sql += ' AND pinned = ?';
    params.push(pinned === 'true' ? 1 : 0);
  }
  
  // Order by pinned first, then by last modified date
  sql += ' ORDER BY pinned DESC, LastModifiedDate DESC';
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching notes:', err);
      res.status(500).json({ error: 'Failed to fetch notes' });
      return;
    }
    res.json(rows);
  });
});

// Get a single note by ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching note:', err);
      res.status(500).json({ error: 'Failed to fetch note' });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    
    res.json(row);
  });
});

// Create a new note
router.post('/', (req, res) => {
  const db = getDatabase();
  const { title, content, category = 'Work' } = req.body;
  
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }
  
  // Check if content contains password
  const isPassword = content.toLowerCase().includes('password:') ? 1 : 0;
  const now = new Date().toISOString();
  
  const sql = `
    INSERT INTO notes (title, content, category, is_password, CreatedDate, LastModifiedDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.run(sql, [title, content, category, isPassword, now, now], function(err) {
    if (err) {
      console.error('Error creating note:', err);
      res.status(500).json({ error: 'Failed to create note' });
      return;
    }
    
    // Return the created note
    db.get('SELECT * FROM notes WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created note:', err);
        res.status(500).json({ error: 'Note created but failed to fetch' });
        return;
      }
      res.status(201).json(row);
    });
  });
});

// Update an existing note
router.put('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const { title, content, category, pinned, archived } = req.body;
  
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }
  
  // Check if content contains password
  const isPassword = content.toLowerCase().includes('password:') ? 1 : 0;
  const now = new Date().toISOString();
  
  const sql = `
    UPDATE notes 
    SET title = ?, content = ?, category = ?, pinned = ?, archived = ?, 
        is_password = ?, LastModifiedDate = ?
    WHERE id = ?
  `;
  
  const params = [
    title || null,
    content,
    category || 'Work',
    pinned ? 1 : 0,
    archived ? 1 : 0,
    isPassword,
    now,
    id
  ];
  
  db.run(sql, params, function(err) {
    if (err) {
      console.error('Error updating note:', err);
      res.status(500).json({ error: 'Failed to update note' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    
    // Return the updated note
    db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching updated note:', err);
        res.status(500).json({ error: 'Note updated but failed to fetch' });
        return;
      }
      res.json(row);
    });
  });
});

// Toggle pin status
router.patch('/:id/pin', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const now = new Date().toISOString();
  
  db.run(
    'UPDATE notes SET pinned = CASE WHEN pinned = 1 THEN 0 ELSE 1 END, LastModifiedDate = ? WHERE id = ?',
    [now, id],
    function(err) {
      if (err) {
        console.error('Error toggling pin:', err);
        res.status(500).json({ error: 'Failed to toggle pin' });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }
      
      // Return the updated note
      db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error fetching updated note:', err);
          res.status(500).json({ error: 'Pin toggled but failed to fetch' });
          return;
        }
        res.json(row);
      });
    }
  );
});

// Toggle archive status
router.patch('/:id/archive', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const now = new Date().toISOString();
  
  db.run(
    'UPDATE notes SET archived = CASE WHEN archived = 1 THEN 0 ELSE 1 END, LastModifiedDate = ? WHERE id = ?',
    [now, id],
    function(err) {
      if (err) {
        console.error('Error toggling archive:', err);
        res.status(500).json({ error: 'Failed to toggle archive' });
        return;
      }
      
      if (this.changes === 0) {
        res.status(404).json({ error: 'Note not found' });
        return;
      }
      
      // Return the updated note
      db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error fetching updated note:', err);
          res.status(500).json({ error: 'Archive toggled but failed to fetch' });
          return;
        }
        res.json(row);
      });
    }
  );
});

// Delete a note
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting note:', err);
      res.status(500).json({ error: 'Failed to delete note' });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }
    
    res.json({ message: 'Note deleted successfully' });
  });
});

module.exports = router;
