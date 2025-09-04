import React from 'react';
import { Search, Plus } from 'lucide-react';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onCreateNote 
}) => {
  return (
    <div className="search-container">
      <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
        <Search 
          size={20} 
          style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#666'
          }} 
        />
        <input
          type="text"
          className="search-input"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ paddingLeft: '44px' }}
        />
      </div>
      
      <select
        className="category-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      
      <button 
        className="create-btn" 
        onClick={onCreateNote}
        title="Create New Note"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default SearchBar;
