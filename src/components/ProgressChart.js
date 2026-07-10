import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProgressChart({ isDarkMode }) {
  const [subjects, setSubjects] = useState([]);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    fetchSubjects();
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

  const getChartBars = () => {
    return subjects.map((subject) => (
      <div key={subject.id} style={styles(isDarkMode).chartBarContainer}>
        <div style={styles(isDarkMode).chartLabel}>{subject.name}</div>
        <div style={styles(isDarkMode).chartBarWrapper}>
          <div style={{...styles(isDarkMode).chartBar, width: `${subject.confidence}%`, background: subject.is_weak ? '#f59e0b' : '#10b981'}}>
            <span style={styles(isDarkMode).chartBarText}>{subject.confidence}%</span>
          </div>
        </div>
      </div>
    ));
  };

  const avgConfidence = subjects.length > 0 
    ? Math.round(subjects.reduce((sum, s) => sum + s.confidence, 0) / subjects.length) 
    : 0;

  return (
    <div style={styles(isDarkMode).container}>
      <div style={styles(isDarkMode).header} onClick={() => setShowChart(!showChart)}>
        <span>📊 Progress Overview</span>
        <span>{showChart ? '▼' : '▲'}</span>
      </div>
      {showChart && (
        <div style={styles(isDarkMode).chartContainer}>
          <div style={styles(isDarkMode).chartHeader}>
            <h4 style={styles(isDarkMode).chartTitle}>Subject Confidence Levels</h4>
          </div>
          {getChartBars()}
          <div style={styles(isDarkMode).stats}>
            <p>📈 Avg Confidence: <strong>{avgConfidence}%</strong></p>
            <p>⚠️ Weak: <strong>{subjects.filter(s => s.is_weak).length}</strong></p>
            <p>✅ Strong: <strong>{subjects.filter(s => !s.is_weak && s.confidence > 70).length}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = (isDarkMode) => ({
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
  chartContainer: {
    padding: '16px',
  },
  chartHeader: {
    marginBottom: '12px',
  },
  chartTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    margin: 0,
  },
  chartBarContainer: {
    marginBottom: '12px',
  },
  chartLabel: {
    fontSize: '12px',
    marginBottom: '4px',
    fontWeight: '500',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  chartBarWrapper: {
    background: isDarkMode ? '#334155' : '#e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '24px',
  },
  chartBar: {
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '10px',
    transition: 'width 0.5s ease',
    borderRadius: '8px',
  },
  chartBarText: {
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
  },
  stats: {
    marginTop: '16px',
    padding: '12px',
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '12px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    flexWrap: 'wrap',
    gap: '8px',
  },
});

export default ProgressChart;