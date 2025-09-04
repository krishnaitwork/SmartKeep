import React, { useState, useEffect } from 'react';
import { X, Pin, Copy } from 'lucide-react';

const NoteModal = ({ note, categories, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Work');
  const [pinned, setPinned] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setCategory(note.category || 'Work');
      setPinned(note.pinned === 1);
    } else {
      // Reset for new note
      setTitle('');
      setContent('');
      setCategory('Work');
      setPinned(false);
    }
  }, [note]);

  const handleSave = () => {
    if (!content.trim()) {
      alert('Content is required');
      return;
    }

    const finalCategory = showNewCategoryInput && newCategory.trim() 
      ? newCategory.trim() 
      : category;

    const noteData = {
      title: title.trim() || null,
      content: content.trim(),
      category: finalCategory,
      pinned: pinned
    };

    onSave(noteData);
  };

  const handleCopy = async () => {
    try {
      const textToCopy = title ? `${title}\n\n${content}` : content;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1200);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title, content, category, pinned, newCategory, showNewCategoryInput]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{note ? 'Edit Note' : 'Create Note'}</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              className="icon-btn"
              onClick={handleCopy}
              title="Copy Note"
              style={{ color: copySuccess ? '#34a853' : 'var(--primary)' }}
            >
              <Copy size={18} />
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>
        
        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              className="form-textarea"
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            {!showNewCategoryInput ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ flex: 1 }}
                >
                  {(categories || []).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowNewCategoryInput(true)}
                  title="Add New Category"
                >
                  +
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter new category..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newCategory.trim()) {
                        setShowNewCategoryInput(false);
                      }
                    }
                    if (e.key === 'Escape') {
                      setShowNewCategoryInput(false);
                      setNewCategory('');
                    }
                  }}
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => {
                    setShowNewCategoryInput(false);
                    setNewCategory('');
                  }}
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label 
              className="pin-toggle"
              onClick={() => setPinned(!pinned)}
            >
              <div className={`pin-checkbox ${pinned ? 'checked' : ''}`}>
                {pinned && <Pin size={12} />}
              </div>
              Pin this note
            </label>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {note ? 'Update' : 'Create'} Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
