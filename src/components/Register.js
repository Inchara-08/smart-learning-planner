import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username: username,
        password: password,
        email: email
      });
      
      console.log('Registration response:', response.data);
      
      setSuccess('✅ Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response) {
        setError(err.response.data.error || 'Registration failed');
      } else if (err.request) {
        setError('Cannot connect to server. Make sure Django is running on port 8000');
      } else {
        setError('An error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Background Image - Full Page */}
      <div style={styles.backgroundImage}></div>
      
      {/* Dark Overlay */}
      <div style={styles.overlay}></div>
      
      {/* Register Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.logo}>📚</div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Start your learning journey today</p>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>👤</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Choose a username"
                required
              />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email (optional)</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="Enter your email"
              />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Min 6 characters"
                required
              />
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>✓</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                placeholder="Re-enter your password"
                required
              />
            </div>
          </div>
          
          <div style={styles.termsRow}>
            <label style={styles.termsCheck}>
              <input type="checkbox" required /> I agree to the 
              <a href="#" style={styles.termsLink}> Terms & Conditions</a>
            </label>
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account? <Link to="/login" style={styles.link}>Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Inter', 'Poppins', -apple-system, sans-serif",
    overflow: 'hidden',
  },
  
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url('https://wallpapercave.com/wp/wp8149811.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    zIndex: 0,
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.45)',
    zIndex: 1,
  },
  
  card: {
    position: 'relative',
    zIndex: 2,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '40px 36px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    animation: 'slideUp 0.6s ease-out',
    margin: '20px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  
  cardHeader: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  
  logo: {
    fontSize: '44px',
    marginBottom: '10px',
    display: 'block',
  },
  
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: '6px 0 0 0',
  },
  
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '13px',
    textAlign: 'center',
  },
  
  success: {
    background: '#dcfce7',
    color: '#16a34a',
    padding: '10px 14px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '13px',
    textAlign: 'center',
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '16px',
    opacity: 0.5,
  },
  
  input: {
    width: '100%',
    padding: '11px 14px 11px 42px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    transition: 'all 0.3s',
    background: '#f8fafc',
    color: '#1e293b',
    outline: 'none',
  },
  
  termsRow: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    marginTop: '4px',
  },
  
  termsCheck: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b',
    cursor: 'pointer',
  },
  
  termsLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
  },
  
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '13px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '4px',
  },
  
  footer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  
  footerText: {
    fontSize: '13px',
    color: '#64748b',
  },
  
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

// Add animation to document
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.12) !important;
    background: white !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .card::-webkit-scrollbar {
    width: 4px;
  }
  
  .card::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .card::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
  }
`;
document.head.appendChild(styleSheet);

export default Register;