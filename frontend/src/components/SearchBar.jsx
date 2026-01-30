import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="search-bar-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Search articles by keyword or enter article ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="search-btn"
          disabled={isLoading}
        >
          {isLoading ? '🔍 Searching...' : '🔍 Search'}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
