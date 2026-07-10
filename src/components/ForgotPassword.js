import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/password-reset/', {
        email: email
      });
      setMessage('✅ Password reset link sent to your email!');
      setEmail('');
    } catch (err) {
      setError('❌ Email not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundImage}></div>
      <div style={styles.overlay}></div>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.logo}>🔑</div>
          <h2 style={styles.title}>Forgot Password?</h2>
          <p style={styles.subtitle}>Enter your email to receive a reset link</p>
        </div>
        
        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                placeholder="Enter your registered email"
                required
              />
            </div>
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p style={styles.footerText}>
            <Link to="/login" style={styles.link}>← Back to Login</Link>
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
    backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
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
    background: 'rgba(0, 0, 0, 0.5)',
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
  },
  
  cardHeader: {
    textAlign: 'center',
    marginBottom: '28px',
  },
  
  logo: {
    fontSize: '44px',
    marginBottom: '10px',
    display: 'block',
  },
  
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '8px 0 0 0',
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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
    fontSize: '14px',
    color: '#64748b',
  },
  
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
  
  success: {
    background: '#dcfce7',
    color: '#16a34a',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '13px',
    textAlign: 'center',
  },
  
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '13px',
    textAlign: 'center',
  },
};

// Add animation
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
`;
document.head.appendChild(styleSheet);

export default ForgotPassword;