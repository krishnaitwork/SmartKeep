import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import SensitiveConfigModal from './components/SensitiveConfigModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { notesAPI } from './services/api';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [categories, setCategories] = useState(['Work', 'Personal', 'Home', 'Finance']);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
    loadCategories();
    
    // Load theme preference
    const savedTheme = localStorage.getItem('smartkeep-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Filter notes based on search term, category, and archived status
  useEffect(() => {
    // Ensure notes is an array before filtering
    if (!notes || !Array.isArray(notes)) {
      setFilteredNotes([]);
      return;
    }

    let filtered = notes.filter(note => {
      const matchesSearch = searchTerm === '' || 
        note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || note.category === selectedCategory;
      const matchesArchived = showArchived ? note.archived === 1 : note.archived === 0;
      
      return matchesSearch && matchesCategory && matchesArchived;
    });

    // Sort by pinned first, then by last modified date
    filtered.sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return b.pinned - a.pinned; // Pinned notes first
      }
      return new Date(b.LastModifiedDate) - new Date(a.LastModifiedDate);
    });

    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedCategory, showArchived]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getAllNotes();
      // Handle both direct array response and response.data structure
      const notesData = Array.isArray(response) ? response : (response.data || []);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await notesAPI.getCategories();
      // Handle both direct array response and response.data structure
      const categoriesData = Array.isArray(response) ? response : (response.data || ['Work', 'Personal', 'Home', 'Finance']);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Keep default categories on error
      setCategories(['Work', 'Personal', 'Home', 'Finance']);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        // Update existing note
        const response = await notesAPI.updateNote(editingNote.id, noteData);
        const updatedNote = response.data || response;
        setNotes(notes.map(note => 
          note.id === editingNote.id ? updatedNote : note
        ));
      } else {
        // Create new note
        const response = await notesAPI.createNote(noteData);
        const newNote = response.data || response;
        setNotes([newNote, ...notes]);
      }
      setIsModalOpen(false);
      setEditingNote(null);
      loadCategories(); // Refresh categories in case a new one was added
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await notesAPI.deleteNote(noteId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleDeleteRequest = (note) => {
    setNoteToDelete(note);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      handleDeleteNote(noteToDelete.id);
      setNoteToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      const response = await notesAPI.togglePin(noteId);
      const updatedNote = response.data || response;
      setNotes(notes.map(note => 
        note.id === noteId ? updatedNote : note
      ));
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleToggleArchive = async (noteId) => {
    try {
      const response = await notesAPI.toggleArchive(noteId);
      const updatedNote = response.data || response;
      setNotes(notes.map(note => 
        note.id === noteId ? updatedNote : note
      ));
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await notesAPI.exportNotes();
      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smartkeep-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImport = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      // Handle both old format (direct array) and new format (with notes property)
      const notesToImport = Array.isArray(data) ? data : (data.notes || []);
      await notesAPI.importNotes(notesToImport);
      loadNotes(); // Reload notes after import
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data. Please check the file format.');
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
    localStorage.setItem('smartkeep-theme', newDarkMode ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading notes...</p>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Header
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onExport={handleExport}
        onImport={handleImport}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onCreateNote={handleCreateNote}
        onOpenConfig={() => setIsConfigOpen(true)}
      />
      
      <div className="container">
        <div className="notes-grid">
          {filteredNotes && filteredNotes.length > 0 && filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteRequest}
              onTogglePin={handleTogglePin}
              onToggleArchive={handleToggleArchive}
            />
          ))}
          
          {(!filteredNotes || filteredNotes.length === 0) && (
            <div className="empty-state">
              <p>{showArchived ? 'No archived notes' : 'No notes yet'}</p>
              {!showArchived && (
                <button onClick={handleCreateNote} className="create-first-note-btn">
                  Create your first note
                </button>
              )}
            </div>
          )}
        </div>
      </div>

            {isModalOpen && (
        <NoteModal
          note={editingNote}
          categories={categories}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveNote}
        />
      )}

      {isConfigOpen && (
        <SensitiveConfigModal
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          noteTitle={noteToDelete?.title}
        />
      )}
    </div>
  );
}

export default App;
