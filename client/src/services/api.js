import axios from 'axios';
import { hasSensitiveContent, maskSensitiveContent } from '../config/sensitiveConfig';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/smartkeep';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      alert('Too many requests. Please wait a moment and try again.');
    } else if (error.response?.status >= 500) {
      alert('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      alert('Request timeout. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const notesAPI = {
  // Get all notes with optional filters
  getAllNotes: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.pinned !== undefined) params.append('pinned', filters.pinned);
    if (filters.archived !== undefined) params.append('archived', filters.archived);
    
    const response = await api.get(`/notes?${params.toString()}`);
    return response.data;
  },

  // Get a specific note by ID
  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Create a new note
  createNote: async (noteData) => {
    const response = await api.post('/notes', noteData);
    return response.data;
  },

  // Update an existing note
  updateNote: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete a note
  deleteNote: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },

  // Toggle pin status
  togglePin: async (id) => {
    const response = await api.patch(`/notes/${id}/pin`);
    return response.data;
  },

  // Toggle archive status
  toggleArchive: async (id) => {
    const response = await api.patch(`/notes/${id}/archive`);
    return response.data;
  },

  // Get all unique categories
  getCategories: async () => {
    const response = await api.get('/notes/categories');
    return response.data;
  },

  // Export all notes
  exportNotes: async () => {
    const response = await api.get('/notes/export');
    return response.data;
  },

  // Import notes from JSON
  importNotes: async (notesData) => {
    const response = await api.post('/notes/import', { notes: notesData });
    return response.data;
  },

  // Get notes statistics
  getStats: async () => {
    try {
      const response = await api.get('/notes/stats');
      return response.data;
    } catch (error) {
      // If stats endpoint doesn't exist, return default stats
      console.warn('Stats endpoint not available, using default stats');
      return {
        total: 0,
        pinned: 0,
        archived: 0,
        categories: 0
      };
    }
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  }
};

// Utility functions
export const apiUtils = {
  // Format date for display
  formatDate: (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  },

  // Check if content contains password marker
  isPasswordNote: (content) => {
    return hasSensitiveContent(content);
  },

  // Mask sensitive content
  maskSensitiveContent: (content, isUnmasked = false) => {
    return maskSensitiveContent(content, isUnmasked);
  },

  // Download file helper
  downloadFile: (data, filename, type = 'application/json') => {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Parse JSON file
  parseJsonFile: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          resolve(json);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Validate note data
  validateNote: (noteData) => {
    const errors = [];
    
    if (!noteData.content || !noteData.content.trim()) {
      errors.push('Content is required');
    }
    
    if (noteData.content && noteData.content.length > 10000) {
      errors.push('Content is too long (maximum 10,000 characters)');
    }
    
    if (noteData.title && noteData.title.length > 200) {
      errors.push('Title is too long (maximum 200 characters)');
    }
    
    if (!noteData.category || !noteData.category.trim()) {
      errors.push('Category is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default api;
