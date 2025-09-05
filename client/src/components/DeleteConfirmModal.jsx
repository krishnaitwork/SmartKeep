import React from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-5" onClick={handleBackdropClick}>
      <div className="bg-card rounded-xl shadow-2xl border border-border w-full max-w-[420px] max-h-[90vh] overflow-hidden relative z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
            <AlertTriangle size={24} style={{ width: '24px', height: '24px', color: '#ef4444' }} />
          </div>
          <button 
            className="bg-transparent border-none cursor-pointer p-2 rounded text-foreground transition-colors hover:bg-accent" 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} style={{ width: '20px', height: '20px', color: 'var(--foreground)' }} />
          </button>
        </div>
        
        <div className="p-6 text-center">
          <h3 className="mb-3 text-xl font-semibold text-foreground">Delete Note?</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Are you sure you want to delete 
            {noteTitle && <span className="font-medium text-foreground mx-1">"{noteTitle}"</span>}? 
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row gap-3 p-4 md:p-6 pt-5 justify-end">
          <button 
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border-none text-sm font-medium cursor-pointer transition-all min-w-[80px] flex items-center justify-center bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border-none text-sm font-medium cursor-pointer transition-all min-w-[80px] flex items-center justify-center bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:outline-none" 
            onClick={handleConfirm}
            aria-label="Confirm delete note"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
