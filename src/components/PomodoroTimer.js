import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PomodoroTimer({ isDarkMode }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('study');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load saved sessions from backend
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:8000/api/pomodoro-stats/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSessionsCompleted(response.data.sessions || 0);
      } catch (error) {
        console.error('Error fetching pomodoro stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Save session to backend when completed
  const saveSession = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const response = await axios.post('http://localhost:8000/api/pomodoro-increment/', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessionsCompleted(response.data.sessions);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            if (sessionType === 'study') {
              saveSession();
              alert('🎉 Study session completed! Take a 5-minute break!');
              setMinutes(5);
              setSeconds(0);
              setSessionType('break');
            } else {
              alert('🎉 Break over! Ready to study again?');
              setMinutes(25);
              setSeconds(0);
              setSessionType('study');
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, sessionType]);

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(sessionType === 'study' ? 25 : 5);
    setSeconds(0);
  };

  const formatTime = () => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const styles = getStyles(isDarkMode);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.timerCard}>
          <p style={{textAlign: 'center', padding: '40px', color: isDarkMode ? '#64748b' : '#94a3b8'}}>Loading timer...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.timerCard}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.headerIcon}>⏱️</span>
          <span style={styles.headerTitle}>Focus Timer</span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            style={styles.toggleBtn}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
        
        {isExpanded && (
          <div style={styles.body}>
            {/* Session Badge */}
            <div style={sessionType === 'study' ? styles.studyBadge : styles.breakBadge}>
              {sessionType === 'study' ? '📚 Focus Time' : '☕ Break Time'}
            </div>
            
            {/* Timer Display */}
            <div style={styles.timerDisplay}>
              <span style={styles.timerText}>{formatTime()}</span>
            </div>
            
            {/* Progress Ring */}
            <div style={styles.progressRing}>
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke={isDarkMode ? '#334155' : '#e2e8f0'}
                  strokeWidth="8"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke={sessionType === 'study' ? '#667eea' : '#f59e0b'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="534"
                  strokeDashoffset={534 - (534 * (1 - (minutes * 60 + seconds) / (sessionType === 'study' ? 1500 : 300)))}
                  transform="rotate(-90 100 100)"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
            </div>
            
            {/* Controls */}
            <div style={styles.controls}>
              {!isActive ? (
                <button onClick={startTimer} style={styles.startBtn}>
                  ▶ Start
                </button>
              ) : (
                <button onClick={pauseTimer} style={styles.pauseBtn}>
                  ⏸ Pause
                </button>
              )}
              <button onClick={resetTimer} style={styles.resetBtn}>
                ↺ Reset
              </button>
            </div>
            
            {/* Stats */}
            <div style={styles.stats}>
              <div style={styles.statItem}>
                <span>✅ Today's Sessions</span>
                <strong style={{fontSize: '20px', color: '#667eea'}}>{sessionsCompleted}</strong>
              </div>
              <div style={styles.statItem}>
                <span>📊 Progress</span>
                <strong>
                  {sessionType === 'study' 
                    ? `${Math.round(((25 - minutes) / 25) * 100)}%` 
                    : `${Math.round(((5 - minutes) / 5) * 100)}%`}
                </strong>
              </div>
            </div>
            
            {/* Message */}
            <div style={styles.message}>
              {sessionType === 'study' 
                ? '🎯 Stay focused! You got this!' 
                : '🌿 Relax and recharge'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getStyles = (isDarkMode) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    width: '100%',
    padding: '20px',
  },
  
  timerCard: {
    background: isDarkMode ? '#1e293b' : 'white',
    borderRadius: '28px',
    boxShadow: isDarkMode ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.12)',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '420px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e8edf4'}`,
  },
  
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '16px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
  },
  
  headerIcon: {
    fontSize: '20px',
  },
  
  headerTitle: {
    fontWeight: '600',
    fontSize: '16px',
    flex: 1,
    marginLeft: '10px',
  },
  
  toggleBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '20px',
    padding: '2px 12px',
    color: 'white',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  
  body: {
    padding: '28px 30px 30px 30px',
    textAlign: 'center',
  },
  
  studyBadge: {
    display: 'inline-block',
    padding: '6px 20px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    background: '#eef2ff',
    color: '#667eea',
    marginBottom: '18px',
  },
  
  breakBadge: {
    display: 'inline-block',
    padding: '6px 20px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    background: '#fffbeb',
    color: '#f59e0b',
    marginBottom: '18px',
  },
  
  timerDisplay: {
    marginBottom: '4px',
  },
  
  timerText: {
    fontSize: '56px',
    fontWeight: '700',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    fontFamily: "'Inter', monospace",
    letterSpacing: '3px',
  },
  
  progressRing: {
    display: 'flex',
    justifyContent: 'center',
    margin: '8px 0 18px 0',
  },
  
  controls: {
    display: 'flex',
    gap: '14px',
    justifyContent: 'center',
    marginBottom: '18px',
  },
  
  startBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s',
    flex: 1,
  },
  
  pauseBtn: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s',
    flex: 1,
  },
  
  resetBtn: {
    background: isDarkMode ? '#334155' : '#e2e8f0',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    border: 'none',
    padding: '12px 32px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s',
    flex: 1,
  },
  
  stats: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '14px 0',
    borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    marginBottom: '14px',
  },
  
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: isDarkMode ? '#94a3b8' : '#94a3b8',
  },
  
  message: {
    fontSize: '13px',
    color: isDarkMode ? '#94a3b8' : '#94a3b8',
    padding: '4px 0',
  },
});

// Hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .toggleBtn:hover {
    background: rgba(255,255,255,0.35) !important;
    transform: scale(1.05);
  }
  
  .startBtn:hover, .pauseBtn:hover, .resetBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
  
  .startBtn:hover {
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  }
  
  .pauseBtn:hover {
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
  }
`;
document.head.appendChild(styleSheet);

export default PomodoroTimer;