import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Pin, Copy } from 'lucide-react';

// Modal behaves like Google Keep single note view:
// - No explicit save button
// - On close: auto-saves only if changes were made (content/category/pin)
// - Existing title shown in header (not editable). New notes have no title field.
// - Copy + Category + Pin controls in bottom toolbar.
const NoteModal = ({ note, categories, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Work');
  const [pinned, setPinned] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const originalRef = useRef({ title: '', content: '', category: 'Work', pinned: false });

  useEffect(() => {
    if (note) {
      const t = note.title || '';
      const c = note.content || '';
      const cat = note.category || 'Work';
      const p = note.pinned === 1;
      setTitle(t);
      setContent(c);
      setCategory(cat);
      setPinned(p);
      originalRef.current = { title: t, content: c, category: cat, pinned: p };
    } else {
      // New note baseline
      setTitle('');
      setContent('');
      setCategory('Work');
      setPinned(false);
      originalRef.current = { title: '', content: '', category: 'Work', pinned: false };
    }
  }, [note]);

  const buildNoteData = () => {
    const finalCategory = showNewCategoryInput && newCategory.trim() ? newCategory.trim() : category;
    return {
      title: title.trim() || null,
      content: content.trim(),
      category: finalCategory,
      pinned: pinned
    };
  };

  const hasChanges = useCallback(() => {
    const base = originalRef.current;
    return (
      base.title !== title ||
      base.content !== content ||
      base.category !== (showNewCategoryInput && newCategory.trim() ? newCategory.trim() : category) ||
      base.pinned !== pinned
    );
  }, [title, content, category, newCategory, showNewCategoryInput, pinned]);

  const commitIfChanged = useCallback(() => {
    const trimmedContent = content.trim();
    // New note: only save if content present
    if (!note && !trimmedContent) return;
    if (!hasChanges()) return; // nothing to do
    const data = buildNoteData();
    onSave(data); // parent closes modal after save
  }, [content, hasChanges, note, onSave, buildNoteData]);

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
  // No explicit save shortcut now – auto-save on close only
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [title, content, category, pinned, newCategory, showNewCategoryInput]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      commitIfChanged();
      onClose();
    }
  };

  const handleExplicitClose = () => {
    commitIfChanged();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-5" onClick={handleOverlayClick}>
      <div className="bg-card text-card-foreground rounded-lg p-4 md:p-5 w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-xl border border-border flex flex-col relative z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-border">
          <input
            type="text"
            className="flex-1 border-none bg-transparent text-primary text-lg font-semibold outline-none mr-4"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus={!note}
            style={{ color: 'var(--primary)' }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className={`border-2 border-primary bg-primary/6 text-primary px-2.5 py-2 h-8 rounded-full flex items-center gap-1 text-xs font-medium transition-all cursor-pointer hover:bg-primary/15 ${copySuccess ? 'bg-blue-600 text-white border-blue-600' : ''}`}
              onClick={handleCopy}
              title={copySuccess ? 'Copied!' : 'Copy note'}
              style={{ borderColor: 'var(--primary)', color: copySuccess ? 'white' : 'var(--primary)' }}
            >
              <Copy size={18} style={{ width: '18px', height: '18px', color: copySuccess ? 'white' : 'var(--primary)' }} />
            </button>
            <button
              type="button"
              className={`w-8 h-8 border-2 border-input bg-background text-foreground flex items-center justify-center rounded-full transition-all cursor-pointer hover:bg-accent hover:border-primary hover:scale-105 ${pinned ? 'text-yellow-400 bg-yellow-50 border-yellow-400' : ''}`}
              onClick={() => setPinned(!pinned)}
              title={pinned ? 'Unpin note' : 'Pin note'}
              style={{ borderColor: pinned ? '#facc15' : 'var(--input)', backgroundColor: pinned ? '#fefce8' : 'var(--background)' }}
            >
              <Pin size={16} style={{ width: '16px', height: '16px', color: pinned ? '#facc15' : 'var(--foreground)' }} />
            </button>
          </div>
        </div>
        
        <form className="flex flex-col gap-3 flex-1 min-h-0" onSubmit={(e) => { e.preventDefault(); /* no manual submit */ }}>
          <div className="flex flex-col gap-1 flex-1 mb-2">
            <textarea
              id="content"
              className="min-h-[150px] max-h-[300px] text-base leading-relaxed p-3 rounded-lg border border-input bg-background text-foreground outline-none transition-colors focus:border-primary"
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              required
              autoFocus
              style={{ 
                backgroundColor: 'var(--background)', 
                color: 'var(--foreground)', 
                borderColor: 'var(--input)' 
              }}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1.5 pt-2 border-t border-border gap-3">
            <div className="flex-1 min-w-[160px] w-full sm:w-auto">
              {!showNewCategoryInput ? (
                <div className="flex items-center gap-2">
                  <select
                    id="category"
                    className="px-2 py-1.5 border border-input rounded-full bg-background text-foreground text-sm outline-none cursor-pointer min-w-[80px] focus:border-primary"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ 
                      backgroundColor: 'var(--background)', 
                      color: 'var(--foreground)', 
                      borderColor: 'var(--input)' 
                    }}
                  >
                    {(categories || []).map((cat) => (
                      <option key={cat} value={cat} style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="w-6 h-6 border border-input rounded-full bg-background text-foreground text-sm cursor-pointer flex items-center justify-center transition-all hover:bg-primary hover:border-primary hover:text-primary-foreground"
                    onClick={() => setShowNewCategoryInput(true)}
                    title="Add New Category"
                    style={{ 
                      backgroundColor: 'var(--background)', 
                      color: 'var(--foreground)', 
                      borderColor: 'var(--input)' 
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="px-2 py-1.5 border border-primary rounded-full bg-background text-foreground text-sm outline-none w-[120px]"
                    placeholder="New category..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ 
                      backgroundColor: 'var(--background)', 
                      color: 'var(--foreground)', 
                      borderColor: 'var(--primary)' 
                    }}
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
                    className="w-5 h-5 border-none rounded-full bg-input text-foreground text-xs cursor-pointer flex items-center justify-center transition-all hover:bg-red-500 hover:text-white"
                    onClick={() => {
                      setShowNewCategoryInput(false);
                      setNewCategory('');
                    }}
                    title="Cancel"
                    style={{ backgroundColor: 'var(--input)', color: 'var(--foreground)' }}
                  >
                    <X size={14} style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button 
                type="button" 
                className="px-4 py-2 bg-primary text-primary-foreground border-none rounded cursor-pointer text-sm font-medium transition-colors hover:bg-primary/90" 
                onClick={handleExplicitClose}
                style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                Close
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
