import React, { useState } from 'react';
import { Pin, Archive, ArchiveRestore, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { hasSensitiveContent, maskSensitiveContent } from '../config/sensitiveConfig';

const NoteCard = ({ note, onEdit, onDelete, onTogglePin, onToggleArchive }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Work': '#1a73e8',
      'Personal': '#e67c73',
      'Home': '#34a853',
      'Finance': '#fbbc04',
    };
    
    // Generate color based on category name hash for custom categories
    if (!colors[category]) {
      let hash = 0;
      for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
      }
      const palette = ['#1a73e8', '#e67c73', '#fbbc04', '#34a853', '#a142f4', '#ff7043'];
      return palette[Math.abs(hash) % palette.length];
    }
    
    return colors[category];
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      const textToCopy = note.title ? `${note.title}\n\n${note.content}` : note.content;
      await navigator.clipboard.writeText(textToCopy);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1200);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    action();
  };

  const renderContent = () => {
    let content = note.content;
    
    // Check if content has sensitive information using the config
    const isSensitive = hasSensitiveContent(content);
    
    if (isSensitive && !showPassword) {
      // Use the config-based masking system
      content = maskSensitiveContent(content);
    }
    
    // Convert URLs to clickable links
    content = content.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: underline;">$1</a>'
    );
    
    return content;
  };

  const hasPassword = hasSensitiveContent(note.content) || note.is_password;

  return (
    <div 
      className={`note-card ${note.pinned ? 'pinned' : ''}`}
      onClick={() => onEdit(note)}
    >
      <div className="note-title">
        {note.title || '(No Title)'}
      </div>
      
      <div 
        className="note-content"
        dangerouslySetInnerHTML={{ __html: renderContent() }}
      />
      
      {hasPassword && (
        <button
          className="note-action-btn"
          onClick={(e) => {
            e.stopPropagation();
            setShowPassword(!showPassword);
          }}
          style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px',
            opacity: 1
          }}
          title={showPassword ? 'Hide Password' : 'Show Password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
      
      <div className="note-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            className="note-category"
            style={{ backgroundColor: getCategoryColor(note.category) }}
          >
            {note.category}
          </span>
          <span className="note-date">
            {formatDate(note.LastModifiedDate)}
          </span>
        </div>
        
        <div className="note-actions">
          <button
            className={`note-action-btn pin ${note.pinned ? 'active' : ''}`}
            onClick={(e) => handleAction(e, () => onTogglePin(note.id))}
            title={note.pinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={16} />
          </button>
          
          <button
            className="note-action-btn copy"
            onClick={handleCopy}
            title="Copy Note"
            style={{ color: copySuccess ? '#34a853' : 'var(--primary)' }}
          >
            <Copy size={16} />
          </button>
          
          <button
            className="note-action-btn archive"
            onClick={(e) => handleAction(e, () => onToggleArchive(note.id))}
            title={note.archived ? 'Unarchive' : 'Archive'}
          >
            {note.archived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
          </button>
          
          <button
            className="note-action-btn delete"
            onClick={(e) => handleAction(e, () => onDelete(note))}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
