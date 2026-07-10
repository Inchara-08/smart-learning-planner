import React, { useState } from 'react';
import axios from 'axios';

function EmailReminder() {
  const [email, setEmail] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [message, setMessage] = useState('');
  const [showSetup, setShowSetup] = useState(false);

  const saveReminder = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    
    const token = localStorage.getItem('access_token');
    try {
      // Save reminder settings (you'll need to add backend endpoint)
      localStorage.setItem('reminder_email', email);
      localStorage.setItem('reminder_time', reminderTime);
      setMessage('✅ Reminder settings saved!');
      setTimeout(() => setMessage(''), 3000);
      
      // Note: For actual email sending, you'd need a backend service
      alert('Note: Email reminders will work after configuring SMTP in Django settings');
    } catch (error) {
      setMessage('❌ Failed to save settings');
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => setShowSetup(!showSetup)} style={styles.toggleBtn}>
        {showSetup ? '▼ Close' : '📧 Set Email Reminders'}
      </button>
      
      {showSetup && (
        <div style={styles.setupPanel}>
          <h4>Daily Study Reminders</h4>
          <p style={styles.note}>Get daily reminders to study at your preferred time</p>
          
          <div style={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label>Reminder Time</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <button onClick={saveReminder} style={styles.saveBtn}>
            Save Reminder Settings
          </button>
          
          {message && <div style={styles.message}>{message}</div>}
          
          <div style={styles.info}>
            <small>💡 Tip: To actually receive emails, configure SMTP in Django settings.py</small>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginBottom: '20px',
  },
  toggleBtn: {
    background: '#ff9800',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  setupPanel: {
    marginTop: '10px',
    padding: '15px',
    background: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginTop: '5px',
  },
  saveBtn: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  message: {
    marginTop: '10px',
    padding: '10px',
    background: '#d4edda',
    color: '#155724',
    borderRadius: '5px',
    textAlign: 'center',
  },
  note: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '15px',
  },
  info: {
    marginTop: '15px',
    padding: '10px',
    background: '#fff3cd',
    borderRadius: '5px',
    fontSize: '11px',
  },
};

export default EmailReminder;