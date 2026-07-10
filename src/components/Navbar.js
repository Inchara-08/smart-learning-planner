import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ toggleDarkMode, isDarkMode }) {
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav style={{
      ...styles.navbar,
      background: isDarkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.85)',
      borderBottom: `1px solid ${isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(0,0,0,0.05)'}`,
    }}>
      <div style={styles.container}>
        <Link to="/" style={{...styles.logo, color: isDarkMode ? '#e2e8f0' : '#1e293b' }}>
          📚 Smart Learning Planner
        </Link>

        <div style={styles.rightSection}>
          {isAuthenticated && (
            <>
              <button 
                onClick={toggleDarkMode} 
                style={styles.darkModeBtn}
                className="darkModeBtn"
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                <span style={styles.logoutIcon}>🚪</span>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backdropFilter: 'blur(12px)',
    padding: '12px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    transition: 'all 0.3s ease',
  },

  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: '20px',
    fontWeight: '700',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.3s ease',
  },

  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  darkModeBtn: {
    padding: '8px 18px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    letterSpacing: '0.3px',
  },

  logoutBtn: {
    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    color: 'white',
    border: 'none',
    padding: '8px 18px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
    whiteSpace: 'nowrap',
  },

  logoutIcon: {
    fontSize: '16px',
  },
};

// Add hover effects with CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .darkModeBtn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  
  .darkModeBtn:active {
    transform: scale(0.95);
  }
  
  .logoutBtn:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.4) !important;
    background: linear-gradient(135deg, #b91c1c, #991b1b) !important;
  }
  
  .logoutBtn:active {
    transform: scale(0.95) !important;
  }
`;
document.head.appendChild(styleSheet);

export default Navbar;