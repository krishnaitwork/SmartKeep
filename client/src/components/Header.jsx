import React from 'react';
import { Moon, Sun, Download, Upload, Archive, ArchiveRestore, Search, Plus, Settings } from 'lucide-react';

const Header = ({ 
  darkMode, 
  onToggleTheme, 
  onExport, 
  onImport, 
  showArchived, 
  onToggleArchived,
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onCreateNote,
  onOpenConfig
}) => {
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImport(file);
      event.target.value = ''; // Reset input
    }
  };

  return (
    <header className="header">
      <h1>📒 SmartKeep</h1>
      
      <div className="header-search">
        <div className="search-group">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="header-search-input"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="header-category-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <button onClick={onCreateNote} className="header-create-btn" title="Create Note">
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <div className="header-actions">
        <button 
          className="icon-btn" 
          onClick={onOpenConfig}
          title="Sensitive Content Settings"
        >
          <Settings size={20} />
        </button>
        
        <button 
          className="icon-btn" 
          onClick={onExport}
          title="Export Notes"
        >
          <Download size={20} />
        </button>
        
        <label className="icon-btn" title="Import Notes">
          <Upload size={20} />
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
        
        <button 
          className={`icon-btn ${showArchived ? 'active' : ''}`}
          onClick={onToggleArchived}
          title={showArchived ? 'Show Active Notes' : 'Show Archived Notes'}
        >
          {showArchived ? <ArchiveRestore size={20} /> : <Archive size={20} />}
        </button>
        
        <div 
          className={`theme-toggle ${darkMode ? 'active' : ''}`}
          onClick={onToggleTheme}
          title="Toggle Theme"
        >
          <div className="theme-toggle-switch">
            {darkMode ? <Moon size={12} /> : <Sun size={12} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
