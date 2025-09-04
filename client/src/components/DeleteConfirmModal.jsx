import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, noteTitle }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delete-confirm-header">
          <div className="delete-confirm-icon">
            <AlertTriangle size={24} color="#ef4444" />
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="delete-confirm-content">
          <h3>Delete Note?</h3>
          <p>
            Are you sure you want to delete 
            {noteTitle && <span className="note-title-preview">"{noteTitle}"</span>}? 
            This action cannot be undone.
          </p>
        </div>
        
        <div className="delete-confirm-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
