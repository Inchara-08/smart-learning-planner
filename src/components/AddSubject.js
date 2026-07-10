import React, { useState } from 'react';
import axios from 'axios';

function AddSubject({ onSubjectAdded }) {
  const [subjectName, setSubjectName] = useState('');
  const [isWeak, setIsWeak] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await axios.post('http://localhost:8000/api/subjects/', {
        name: subjectName,
        is_weak: isWeak,
        confidence: isWeak ? 30 : 70
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage(`Subject "${subjectName}" added!`);
      setSubjectName('');
      setIsWeak(false);
      if (onSubjectAdded) onSubjectAdded();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding subject');
      console.error(error);
    }
  };

  return (
    <div style={styles.card}>
      <h3>Add New Subject</h3>
      {message && <div style={styles.message}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject name (e.g., Mathematics)"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          style={styles.input}
          required
        />
        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={isWeak}
            onChange={(e) => setIsWeak(e.target.checked)}
          />
          This is a weak subject for me
        </label>
        <button type="submit" style={styles.button}>Add Subject</button>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginTop: '20px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  checkbox: {
    display: 'block',
    marginBottom: '10px',
  },
  button: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    background: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
};

export default AddSubject;