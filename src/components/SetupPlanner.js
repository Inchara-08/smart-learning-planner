import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupPlanner } from '../services/api';
import axios from 'axios';

function SetupPlanner() {
  const [formData, setFormData] = useState({
    exam_date: '',
    goal: '',
    daily_study_hours: 4,
    weak_subjects: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    
    try {
      // Step 1: Save the setup data
      await setupPlanner(formData);
      localStorage.setItem('planner_setup', 'true');
      
      // Step 2: Generate smart schedule
      const token = localStorage.getItem('access_token');
      const scheduleResponse = await axios.get('http://localhost:8000/api/generate-schedule/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Schedule generated:', scheduleResponse.data);
      
      setMessage('✅ Study plan created successfully! Redirecting to dashboard...');
      setIsError(false);
      
      setTimeout(() => navigate('/dashboard'), 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error creating study plan. Please try again.');
      setIsError(true);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.headerIcon}>🎯</span>
          <h2 style={styles.title}>Setup Your Learning Plan</h2>
          <p style={styles.subtitle}>Personalize your study journey</p>
        </div>
        
        {message && (
          <div style={isError ? styles.errorMsg : styles.successMsg}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>📅 Exam Date</label>
            <input
              type="date"
              value={formData.exam_date}
              onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>🎯 Your Goal</label>
            <textarea
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
              style={styles.textarea}
              placeholder="e.g., Score 90% in exams, Learn Python, etc."
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>⏰ Daily Study Hours</label>
            <input
              type="number"
              value={formData.daily_study_hours}
              onChange={(e) => setFormData({...formData, daily_study_hours: e.target.value})}
              style={styles.input}
              min="1"
              max="12"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>📚 Weak Subjects</label>
            <input
              type="text"
              value={formData.weak_subjects}
              onChange={(e) => setFormData({...formData, weak_subjects: e.target.value})}
              style={styles.input}
              placeholder="e.g., Mathematics, Physics, English"
            />
            <small style={styles.hint}>Separate multiple subjects with commas</small>
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating Plan...' : '🚀 Create My Study Plan'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 70px)',
    padding: '30px 20px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
  },
  
  card: {
    background: 'white',
    borderRadius: '24px',
    padding: '30px 35px 35px 35px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    border: '1px solid #e8edf4',
    maxHeight: '85vh',
    overflowY: 'auto',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  
  headerIcon: {
    fontSize: '36px',
    display: 'block',
    marginBottom: '6px',
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
    color: '#94a3b8',
    margin: '4px 0 0 0',
  },
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
  },
  
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.3s',
    background: '#fafcff',
    color: '#1e293b',
    outline: 'none',
  },
  
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.3s',
    background: '#fafcff',
    color: '#1e293b',
    outline: 'none',
    minHeight: '70px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  
  hint: {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '3px',
  },
  
  button: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    marginTop: '4px',
    flexShrink: 0,
  },
  
  successMsg: {
    background: '#dcfce7',
    color: '#16a34a',
    padding: '10px 14px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '13px',
    textAlign: 'center',
  },
  
  errorMsg: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '10px',
    marginBottom: '16px',
    fontSize: '13px',
    textAlign: 'center',
  },
};

// Add focus styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  input:focus, textarea:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1) !important;
    background: white !important;
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.35);
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .card::-webkit-scrollbar {
    width: 4px;
  }
  
  .card::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .card::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
  }
`;
document.head.appendChild(styleSheet);

export default SetupPlanner;