import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SmartSchedule({ isDarkMode }) {
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(true); // Changed to true (open by default)
  const [generating, setGenerating] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);

  useEffect(() => {
    fetchSubjects();
    loadSavedSchedule();
  }, []);

  const fetchSubjects = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:8000/api/subjects/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadSavedSchedule = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:8000/api/generate-schedule/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.schedule && response.data.schedule.length > 0) {
        setSchedule(response.data.schedule);
        setHasSchedule(true);
        setShowSchedule(true);
      }
    } catch (error) {
      console.error('No saved schedule:', error);
    }
  };

  const generateSchedule = async () => {
    setGenerating(true);
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get('http://localhost:8000/api/generate-schedule/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.schedule && response.data.schedule.length > 0) {
        setSchedule(response.data.schedule);
        setHasSchedule(true);
        setShowSchedule(true);
      } else {
        alert('Please add subjects first!');
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Please add subjects first!');
    } finally {
      setGenerating(false);
    }
  };

  const getPriorityColor = (priority) => {
    if (priority.includes('High')) return { bg: '#dc2626', text: 'white' };
    if (priority.includes('Medium')) return { bg: '#f59e0b', text: 'white' };
    return { bg: '#22c55e', text: 'white' };
  };

  const getPriorityLabel = (priority) => {
    if (priority.includes('High')) return 'High';
    if (priority.includes('Medium')) return 'Medium';
    return 'Low';
  };

  const styles = getStyles(isDarkMode);

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setShowSchedule(!showSchedule)}>
        <span>📅 Smart Schedule</span>
        <span>{showSchedule ? '▼' : '▲'}</span>
      </div>
      
      {showSchedule && (
        <div style={styles.scheduleContainer}>
          <button 
            onClick={generateSchedule} 
            disabled={generating} 
            style={styles.generateBtn}
          >
            {generating ? '⏳ Generating...' : (hasSchedule ? '🔄 Regenerate Schedule' : '🎯 Generate Schedule')}
          </button>
          
          {schedule.length > 0 ? (
            <div style={styles.scheduleList}>
              {schedule.map((item, idx) => (
                <div key={idx} style={styles.scheduleItem}>
                  <div style={styles.scheduleHeader}>
                    <span style={styles.day}>{item.day}</span>
                    <span style={{...styles.priorityBadge, background: getPriorityColor(item.priority).bg}}>
                      {getPriorityLabel(item.priority)}
                    </span>
                  </div>
                  <div style={styles.subjectName}>📚 {item.subject}</div>
                  <div style={styles.details}>
                    <span>⏱️ {item.hours}h</span>
                    <span style={styles.reason}>{item.reason}</span>
                  </div>
                </div>
              ))}
              <div style={styles.tip}>
                💡 Focus on High priority subjects first
              </div>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No schedule generated yet.</p>
              <p style={styles.emptyHint}>Click "Generate Schedule" to create your study plan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const getStyles = (isDarkMode) => ({
  container: {
    marginBottom: '0px',
    background: isDarkMode ? '#1e293b' : 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
  },
  header: {
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    padding: '12px 16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: '600',
    fontSize: '14px',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
  },
  scheduleContainer: {
    padding: '16px',
  },
  generateBtn: {
    width: '100%',
    padding: '10px',
    background: isDarkMode ? '#334155' : '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '14px',
    transition: 'all 0.3s',
  },
  scheduleList: {
    marginTop: '4px',
  },
  scheduleItem: {
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    padding: '12px 14px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
  },
  scheduleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  day: {
    fontWeight: '700',
    color: isDarkMode ? '#e2e8f0' : '#334155',
    fontSize: '13px',
  },
  priorityBadge: {
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: '600',
    color: 'white',
  },
  subjectName: {
    fontWeight: '600',
    fontSize: '14px',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    marginBottom: '4px',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    flexWrap: 'wrap',
    gap: '4px',
  },
  reason: {
    fontSize: '11px',
    color: isDarkMode ? '#64748b' : '#94a3b8',
    fontStyle: 'italic',
  },
  tip: {
    marginTop: '12px',
    padding: '10px',
    background: isDarkMode ? '#0f172a' : '#f0fdf4',
    borderRadius: '8px',
    fontSize: '12px',
    color: isDarkMode ? '#86efac' : '#166534',
    textAlign: 'center',
    border: `1px solid ${isDarkMode ? '#334155' : '#bbf7d0'}`,
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px 20px',
    color: isDarkMode ? '#94a3b8' : '#94a3b8',
  },
  emptyHint: {
    fontSize: '12px',
    marginTop: '6px',
    color: isDarkMode ? '#64748b' : '#a0aec0',
  },
});

export default SmartSchedule;