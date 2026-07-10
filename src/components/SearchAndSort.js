import React, { useState } from 'react';

function SearchAndSort({ onSearch, isDarkMode }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="🔍 Search subjects..."
          value={searchTerm}
          onChange={handleSearch}
          className={isDarkMode ? 'search-input-dark' : 'search-input-light'}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  searchBox: {
    width: '100%',
    maxWidth: '350px',
  },
};

// Use CSS classes with !important
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .search-input-light {
    width: 100% !important;
    padding: 10px 14px !important;
    border: 2px solid #e2e8f0 !important;
    border-radius: 10px !important;
    font-size: 14px !important;
    outline: none !important;
    background-color: #ffffff !important;
    color: #1e293b !important;
    transition: all 0.3s ease !important;
  }
  
  .search-input-dark {
    width: 100% !important;
    padding: 10px 14px !important;
    border: 2px solid #475569 !important;
    border-radius: 10px !important;
    font-size: 14px !important;
    outline: none !important;
    background-color: #1e293b !important;
    color: #ffffff !important;
    transition: all 0.3s ease !important;
  }
  
  .search-input-light:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15) !important;
    background-color: #ffffff !important;
    color: #1e293b !important;
  }
  
  .search-input-dark:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15) !important;
    background-color: #1e293b !important;
    color: #ffffff !important;
  }
  
  .search-input-light::placeholder,
  .search-input-dark::placeholder {
    color: #94a3b8 !important;
  }
  
  .search-input-light:-webkit-autofill,
  .search-input-dark:-webkit-autofill,
  .search-input-light:-webkit-autofill:hover,
  .search-input-dark:-webkit-autofill:hover,
  .search-input-light:-webkit-autofill:focus,
  .search-input-dark:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px ${(isDarkMode) => isDarkMode ? '#1e293b' : '#ffffff'} inset !important;
    -webkit-text-fill-color: ${(isDarkMode) => isDarkMode ? '#ffffff' : '#1e293b'} !important;
  }
`;
document.head.appendChild(styleSheet);

export default SearchAndSort;