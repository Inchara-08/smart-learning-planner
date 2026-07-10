import React, { useState } from 'react';

function StudyPlan({ studyPlan, isDarkMode }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!studyPlan || !studyPlan.schedule || studyPlan.schedule.length === 0) {
    return (
      <div style={getStyles(isDarkMode).emptyState}>
        <p style={getStyles(isDarkMode).emptyIcon}>📖</p>
        <p style={getStyles(isDarkMode).emptyText}>No study plan yet.</p>
        <p style={getStyles(isDarkMode).hint}>Go to "Setup Study Plan" to create your personalized learning plan!</p>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    if (priority.includes('High')) return '#dc2626';
    if (priority.includes('Medium')) return '#f59e0b';
    return '#22c55e';
  };

  const getPriorityLabel = (priority) => {
    if (priority.includes('High')) return 'High Priority';
    if (priority.includes('Medium')) return 'Medium Priority';
    return 'Low Priority';
  };

  const totalPomodoros = studyPlan.schedule.reduce((sum, item) => {
    return sum + (item.hours * 2);
  }, 0);

  const styles = getStyles(isDarkMode);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>📋 Your Study Plan</h3>
          <p style={styles.subtitle}>{studyPlan.schedule.length} subjects • {studyPlan.total_hours || 0}h total</p>
        </div>
        <div style={styles.stats}>
          <span style={styles.statBadge}>⏱️ {studyPlan.total_hours || 0}h</span>
          <span style={styles.statBadge}>🍅 {totalPomodoros} sessions</span>
        </div>
      </div>
      
      {/* Goal */}
      {studyPlan.goal && (
        <div style={styles.goalBox}>
          <span style={styles.goalIcon}>🎯</span>
          <span style={styles.goalText}>{studyPlan.goal}</span>
        </div>
      )}
      
      {/* Weak Subjects */}
      {studyPlan.weak_subjects && (
        <div style={styles.weakBox}>
          <span style={styles.weakIcon}>📌</span>
          <span style={styles.weakText}>Focus: {studyPlan.weak_subjects}</span>
        </div>
      )}

      {/* Schedule Grid */}
      <div style={styles.scheduleGrid}>
        {studyPlan.schedule.map((item, index) => {
          const pomodoros = item.hours * 2;
          return (
            <div key={index} style={styles.scheduleCard}>
              <div style={styles.scheduleDay}>{item.day}</div>
              <div style={styles.scheduleSubject}>{item.subject}</div>
              <div style={styles.scheduleRow}>
                <span style={{...styles.priorityDot, background: getPriorityColor(item.priority)}}></span>
                <span style={styles.priorityLabel}>{getPriorityLabel(item.priority)}</span>
                <span style={styles.hoursBadge}>{item.hours}h</span>
              </div>
              {showBreakdown && (
                <div style={styles.breakdown}>
                  <span>📖 {item.hours}h study</span>
                  <span>☕ {Math.round(item.hours * 0.25)}h break</span>
                  <span>📝 {Math.round(item.hours * 0.5)}h practice</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Breakdown Toggle */}
      <button 
        onClick={() => setShowBreakdown(!showBreakdown)} 
        style={styles.toggleBtn}
      >
        {showBreakdown ? '− Hide Details' : '+ Show Details'}
      </button>

      {/* Tip */}
      <div style={styles.tipBox}>
        <span style={styles.tipIcon}>💡</span>
        <span style={styles.tipText}>Focus on high priority subjects first</span>
      </div>
    </div>
  );
}

const getStyles = (isDarkMode) => ({
  container: {
    padding: '4px 0',
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px',
  },
  
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    margin: 0,
  },
  
  subtitle: {
    fontSize: '13px',
    color: isDarkMode ? '#94a3b8' : '#94a3b8',
    margin: '4px 0 0 0',
  },
  
  stats: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  
  statBadge: {
    background: isDarkMode ? '#1e293b' : '#f1f5f9',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    color: isDarkMode ? '#94a3b8' : '#475569',
  },
  
  goalBox: {
    background: isDarkMode ? '#1e293b' : '#eef2ff',
    padding: '10px 16px',
    borderRadius: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  goalIcon: {
    fontSize: '16px',
  },
  
  goalText: {
    fontSize: '14px',
    fontWeight: '500',
    color: isDarkMode ? '#93c5fd' : '#4338ca',
  },
  
  weakBox: {
    background: isDarkMode ? '#1e293b' : '#fefce8',
    padding: '10px 16px',
    borderRadius: '10px',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  weakIcon: {
    fontSize: '16px',
  },
  
  weakText: {
    fontSize: '14px',
    fontWeight: '500',
    color: isDarkMode ? '#fcd34d' : '#854d0e',
  },
  
  scheduleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '12px',
  },
  
  scheduleCard: {
    background: isDarkMode ? '#1e293b' : '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    textAlign: 'center',
  },
  
  scheduleDay: {
    fontSize: '14px',
    fontWeight: '700',
    color: isDarkMode ? '#e2e8f0' : '#334155',
    marginBottom: '4px',
  },
  
  scheduleSubject: {
    fontSize: '14px',
    fontWeight: '500',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    marginBottom: '10px',
  },
  
  scheduleRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  
  priorityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  
  priorityLabel: {
    fontSize: '11px',
    fontWeight: '500',
    color: isDarkMode ? '#94a3b8' : '#475569',
  },
  
  hoursBadge: {
    fontSize: '11px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    background: isDarkMode ? '#0f172a' : '#f1f5f9',
    padding: '2px 10px',
    borderRadius: '12px',
  },
  
  breakdown: {
    marginTop: '10px',
    padding: '8px',
    background: isDarkMode ? '#0f172a' : '#f1f5f9',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '11px',
    color: isDarkMode ? '#94a3b8' : '#475569',
  },
  
  toggleBtn: {
    background: 'none',
    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    marginBottom: '14px',
    transition: 'all 0.2s',
  },
  
  tipBox: {
    background: isDarkMode ? '#1e293b' : '#f0fdf4',
    padding: '10px 16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: `1px solid ${isDarkMode ? '#334155' : '#bbf7d0'}`,
  },
  
  tipIcon: {
    fontSize: '16px',
  },
  
  tipText: {
    fontSize: '13px',
    color: isDarkMode ? '#86efac' : '#166534',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: isDarkMode ? '#94a3b8' : '#475569',
    marginBottom: '8px',
  },
  
  hint: {
    fontSize: '13px',
    color: isDarkMode ? '#64748b' : '#94a3b8',
  },
});

export default StudyPlan;