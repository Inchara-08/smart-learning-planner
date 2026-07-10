import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddSubject from './AddSubject';
import TopicManager from './TopicManager';
import PomodoroTimer from './PomodoroTimer';
import ProgressChart from './ProgressChart';
import SearchAndSort from './SearchAndSort';
import ExportReport from './ExportReport';
import EmailReminder from './EmailReminder';
import SmartSchedule from './SmartSchedule';
import StudyPlan from './StudyPlan';

function Dashboard({ isDarkMode: propIsDarkMode, setIsDarkMode: propSetIsDarkMode }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIsWeak, setEditIsWeak] = useState(false);
  const [editConfidence, setEditConfidence] = useState(50);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  
  const [isDarkMode, setIsDarkModeState] = useState(propIsDarkMode || false);

  useEffect(() => {
    setIsDarkModeState(propIsDarkMode);
  }, [propIsDarkMode]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (propSetIsDarkMode) {
      propSetIsDarkMode(isDarkMode);
    }
  }, [isDarkMode, propSetIsDarkMode]);

  useEffect(() => {
    const handleDarkModeChange = (event) => {
      const newMode = event.detail;
      setIsDarkModeState(newMode);
      if (propSetIsDarkMode) {
        propSetIsDarkMode(newMode);
      }
      localStorage.setItem('darkMode', JSON.stringify(newMode));
    };
    
    window.addEventListener('darkModeChanged', handleDarkModeChange);
    
    return () => {
      window.removeEventListener('darkModeChanged', handleDarkModeChange);
    };
  }, [propSetIsDarkMode]);

  const fetchDashboard = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    try {
      const response = await axios.get('http://localhost:8000/api/dashboard/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (dashboardData?.subjects) {
      let filtered = [...dashboardData.subjects];
      if (searchTerm) {
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredSubjects(filtered);
    }
  }, [dashboardData, searchTerm]);

  const handleDeleteSubject = async (subjectId, subjectName) => {
    if (window.confirm(`Are you sure you want to delete "${subjectName}"?`)) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`http://localhost:8000/api/subjects/${subjectId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDashboard();
      } catch (error) {
        alert('❌ Failed to delete subject');
      }
    }
  };

  const startEdit = (subject) => {
    setEditingSubject(subject);
    setEditName(subject.name);
    setEditIsWeak(subject.is_weak);
    setEditConfidence(subject.confidence);
  };

  const saveEdit = async () => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`http://localhost:8000/api/subjects/${editingSubject.id}/`, {
        name: editName,
        is_weak: editIsWeak,
        confidence: editConfidence
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingSubject(null);
      fetchDashboard();
    } catch (error) {
      alert('❌ Failed to update subject');
    }
  };

  const cancelEdit = () => {
    setEditingSubject(null);
    setEditName('');
    setEditIsWeak(false);
    setEditConfidence(50);
  };

  const username = localStorage.getItem('username');
  
  const averageConfidence = () => {
    if (!dashboardData?.subjects || dashboardData.subjects.length === 0) return 0;
    const total = dashboardData.subjects.reduce((sum, subject) => sum + subject.confidence, 0);
    return Math.round(total / dashboardData.subjects.length);
  };

  const circularProgress = averageConfidence();
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circularProgress / 100) * circumference;

  const s = styles(isDarkMode);

  if (loading) {
    return (
      <div style={s.loadingContainer}>
        <div style={s.spinner}></div>
        <p style={s.loadingText}>Loading your study plan...</p>
      </div>
    );
  }

  const menuItems = [
    { icon: '🏠', label: 'Home', id: 'overview' },
    { icon: '📚', label: 'Subjects', id: 'subjects' },
    { icon: '📅', label: 'Schedule', id: 'schedule' },
    { icon: '📊', label: 'Analytics', id: 'analytics' },
    { icon: '⏱️', label: 'Timer', id: 'timer' },
  ];

  const stats = [
    { value: dashboardData?.subjects?.length || 0, label: 'Subjects', icon: '📚', color: '#667eea', bg: isDarkMode ? '#1e293b' : '#eef2ff' },
    { value: `${averageConfidence()}%`, label: 'Avg Confidence', icon: '🎯', color: '#10b981', bg: isDarkMode ? '#1e293b' : '#ecfdf5' },
    { value: '7', label: 'Day Streak', icon: '🔥', color: '#f59e0b', bg: isDarkMode ? '#1e293b' : '#fffbeb' },
    { value: '12', label: 'Tasks Done', icon: '✅', color: '#8b5cf6', bg: isDarkMode ? '#1e293b' : '#f5f3ff' },
  ];

  return (
    <div style={s.app}>
      <aside style={s.sidebar}>
        <div style={s.logoArea}>
          <div style={s.logoIcon}>✨</div>
          <div style={s.logoText}>
            <span style={s.logoBold}>learn</span><span style={s.logoLight}>smart</span>
          </div>
        </div>

        <div style={s.profileArea}>
          <div style={s.avatar}>
            {username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={s.profileText}>
            <p style={s.userName}>{username || 'Student'}</p>
            <p style={s.userRole}>Learning Journey</p>
          </div>
        </div>

        <nav style={s.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...s.navItem,
                background: activeTab === item.id ? (isDarkMode ? '#1e293b' : '#f0fdf4') : 'transparent',
                color: activeTab === item.id ? '#10b981' : (isDarkMode ? '#94a3b8' : '#64748b'),
                borderLeft: activeTab === item.id ? '3px solid #10b981' : '3px solid transparent',
              }}
            >
              <span style={s.navIcon}>{item.icon}</span>
              <span style={s.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={s.sidebarFooter}></div>
      </aside>

      <main style={s.main}>
        <div style={s.welcomeHeader}>
          <div>
            <h1 style={s.greeting}>Welcome back, <span style={s.usernameHighlight}>{username}</span>! 👋</h1>
            <p style={s.subGreeting}>Let's make today productive and achieve your learning goals!</p>
          </div>
          <SearchAndSort 
            onSearch={setSearchTerm}
            isDarkMode={isDarkMode}
          />
        </div>

        <div style={s.circularRow}>
          <div style={s.circularCard}>
            <div style={s.circularContainer}>
              <svg width="220" height="220" viewBox="0 0 220 220">
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke={isDarkMode ? '#334155' : '#e5e7eb'}
                  strokeWidth="12"
                />
                <circle
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 110 110)"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
                <text x="110" y="105" textAnchor="middle" fill={isDarkMode ? '#e2e8f0' : '#333'} fontSize="32" fontWeight="bold">
                  {circularProgress}%
                </text>
                <text x="110" y="130" textAnchor="middle" fill={isDarkMode ? '#64748b' : '#94a3b8'} fontSize="12">
                  Overall Progress
                </text>
              </svg>
            </div>
            <div style={s.circularStats}>
              <div style={s.circularStatItem}>
                <span style={s.circularDot}></span>
                <span>Completed: 45%</span>
              </div>
              <div style={s.circularStatItem}>
                <span style={{...s.circularDot, background: '#f59e0b'}}></span>
                <span>In Progress: 35%</span>
              </div>
              <div style={s.circularStatItem}>
                <span style={{...s.circularDot, background: '#ef4444'}}></span>
                <span>Pending: 20%</span>
              </div>
            </div>
          </div>

          <div style={s.statsGrid}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{...s.statCard, background: stat.bg}}>
                <div style={{...s.statIconWrapper, background: stat.color}}>
                  <span style={s.statIcon}>{stat.icon}</span>
                </div>
                <div>
                  <h3 style={s.statValue}>{stat.value}</h3>
                  <p style={s.statLabel}>{stat.label}</p>
                </div>
                <div style={{...s.statBorder, background: stat.color}}></div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.tabsContainer}>
          {['Overview', 'Subjects', 'Schedule', 'Analytics', 'Timer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              style={{
                ...s.tabBtn,
                background: activeTab === tab.toLowerCase() ? '#10b981' : 'transparent',
                color: activeTab === tab.toLowerCase() ? 'white' : (isDarkMode ? '#94a3b8' : '#64748b'),
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={s.contentArea}>
          {activeTab === 'overview' && (
            <>
              <div style={s.sectionTitle}>
                <div style={s.sectionIcon}>📈</div>
                <h2 style={{color: isDarkMode ? '#e2e8f0' : '#1f2937'}}>Quick Insights</h2>
              </div>

              <div style={s.glassCard}>
                <StudyPlan studyPlan={dashboardData?.study_plan} isDarkMode={isDarkMode} />
              </div>

              <div style={s.twoColGrid}>
                <div style={s.glassCard}>
                  <ProgressChart isDarkMode={isDarkMode} />
                </div>
                <div style={s.glassCard}>
                  <SmartSchedule isDarkMode={isDarkMode} />
                </div>
              </div>
              <div style={s.glassCard}>
                <EmailReminder />
              </div>
            </>
          )}

          {activeTab === 'subjects' && (
            <div style={s.glassCard}>
              <div style={s.cardHeader}>
                <div>
                  <h3 style={s.cardTitle}>📚 My Subjects</h3>
                  <p style={s.cardSubtitle}>Manage your learning subjects and topics</p>
                </div>
                <button onClick={() => setShowAddSubject(!showAddSubject)} style={s.addBtn}>
                  {showAddSubject ? 'Cancel' : '+ Add Subject'}
                </button>
              </div>
              <div style={s.cardBody}>
                {showAddSubject && <AddSubject onSubjectAdded={fetchDashboard} />}
                
                {filteredSubjects.length > 0 ? (
                  <div style={s.subjectsGrid}>
                    {filteredSubjects.map((subject) => (
                      <div key={subject.id} style={s.subjectCard}>
                        {editingSubject?.id === subject.id ? (
                          <div style={s.editForm}>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              style={s.editInput}
                              autoFocus
                            />
                            <label style={s.checkboxLabel}>
                              <input type="checkbox" checked={editIsWeak} onChange={(e) => setEditIsWeak(e.target.checked)} />
                              Mark as weak subject
                            </label>
                            <div style={s.confidenceControl}>
                              <label>Confidence: {editConfidence}%</label>
                              <input type="range" min="0" max="100" value={editConfidence} onChange={(e) => setEditConfidence(parseInt(e.target.value))} style={s.slider} />
                              <div style={s.confidenceBtns}>
                                <button onClick={() => setEditConfidence(Math.max(0, editConfidence - 10))} style={s.minusBtn}>-10</button>
                                <button onClick={() => setEditConfidence(Math.min(100, editConfidence + 10))} style={s.plusBtn}>+10</button>
                              </div>
                            </div>
                            <div style={s.editActions}>
                              <button onClick={saveEdit} style={s.saveBtn}>Save</button>
                              <button onClick={cancelEdit} style={s.cancelBtn}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={s.subjectCardHeader}>
                              <div>
                                <h4 style={s.subjectName}>{subject.name}</h4>
                                <span style={subject.is_weak ? s.weakChip : s.goodChip}>
                                  {subject.is_weak ? '⚠️ Needs Attention' : '✅ On Track'}
                                </span>
                              </div>
                              <div>
                                <button onClick={() => startEdit(subject)} style={s.iconBtn}>✏️</button>
                                <button onClick={() => handleDeleteSubject(subject.id, subject.name)} style={s.iconBtn}>🗑️</button>
                              </div>
                            </div>
                            <div style={s.progressWrapper}>
                              <div style={s.progressLabel}>
                                <span>Confidence</span>
                                <span>{subject.confidence}%</span>
                              </div>
                              <div style={s.progressTrack}>
                                <div style={{...s.progressFill, width: `${subject.confidence}%`}}></div>
                              </div>
                            </div>
                            <TopicManager subject={subject} onTopicUpdate={fetchDashboard} isDarkMode={isDarkMode} />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={s.emptyState}>
                    <p>No subjects yet. Add your first subject!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div style={s.glassCard}>
              <SmartSchedule isDarkMode={isDarkMode} />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div style={s.glassCard}>
              <ProgressChart isDarkMode={isDarkMode} />
              <div style={{marginTop: '24px'}}>
                <ExportReport isDarkMode={isDarkMode} />
              </div>
            </div>
          )}

          {activeTab === 'timer' && (
            <div style={s.glassCard}>
              <PomodoroTimer isDarkMode={isDarkMode} />
            </div>
          )}
        </div>
      </main>

      <div style={s.floatingButtons}>
        <button 
          style={s.floatingBtn} 
          onClick={() => window.location.href='/setup'}
        >
          🎯 Setup Study Plan
        </button>
        <ExportReport isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}

const styles = (isDarkMode) => ({
  app: {
    display: 'flex',
    minHeight: '100vh',
    background: isDarkMode ? '#0f172a' : '#f0f4f8',
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },

  sidebar: {
    width: '280px',
    background: isDarkMode ? '#1e293b' : '#ffffff',
    backdropFilter: isDarkMode ? 'blur(10px)' : 'none',
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${isDarkMode ? '#334155' : '#f1f3f5'}`,
    height: '100vh',
    position: 'sticky',
    top: 0,
  },

  logoArea: {
    padding: '32px 24px 24px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f3f5'}`,
  },

  logoIcon: {
    fontSize: '28px',
  },

  logoText: {
    display: 'flex',
    alignItems: 'baseline',
  },

  logoBold: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#10b981',
    letterSpacing: '-0.5px',
  },

  logoLight: {
    fontSize: '22px',
    fontWeight: '300',
    color: isDarkMode ? '#94a3b8' : '#8b7355',
    letterSpacing: '-0.5px',
  },

  profileArea: {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f3f5'}`,
  },

  avatar: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '600',
    color: 'white',
    flexShrink: 0,
  },

  profileText: {
    overflow: 'hidden',
  },

  userName: {
    fontSize: '15px',
    fontWeight: '600',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    margin: 0,
  },

  userRole: {
    fontSize: '11px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    margin: '4px 0 0 0',
  },

  nav: {
    flex: 1,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s',
    width: '100%',
    textAlign: 'left',
  },

  navIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },

  navLabel: {
    whiteSpace: 'nowrap',
  },

  sidebarFooter: {
    padding: '20px',
    borderTop: `1px solid ${isDarkMode ? '#334155' : '#f1f3f5'}`,
    minHeight: '20px',
  },

  main: {
    flex: 1,
    padding: '32px 40px',
    overflowY: 'auto',
    height: '100vh',
  },

  welcomeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px',
  },

  greeting: {
    fontSize: '28px',
    fontWeight: '600',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    margin: 0,
  },

  usernameHighlight: {
    color: '#10b981',
  },

  subGreeting: {
    fontSize: '14px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    margin: '8px 0 0 0',
  },

  circularRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '24px',
    marginBottom: '32px',
  },

  circularCard: {
    background: isDarkMode ? '#1e293b' : '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
    flexWrap: 'wrap',
    border: `1px solid ${isDarkMode ? '#334155' : '#f1f3f5'}`,
  },

  circularContainer: {
    display: 'flex',
    justifyContent: 'center',
  },

  circularStats: {
    flex: 1,
  },

  circularStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
    fontSize: '13px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
  },

  circularDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#667eea',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },

  statCard: {
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
    transition: 'transform 0.3s',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    border: `1px solid ${isDarkMode ? '#334155' : '#f1f3f5'}`,
    background: isDarkMode ? '#1e293b' : '#ffffff',
    position: 'relative',
    overflow: 'hidden',
  },

  statBorder: {
    height: '4px',
    width: '100%',
    borderRadius: '0 0 16px 16px',
    marginTop: '4px',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  statIconWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statIcon: {
    fontSize: '24px',
  },

  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    margin: 0,
  },

  statLabel: {
    fontSize: '12px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    margin: '4px 0 0 0',
  },

  tabsContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    background: isDarkMode ? '#1e293b' : '#ffffff',
    padding: '8px',
    borderRadius: '60px',
    boxShadow: isDarkMode ? '0 2px 10px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
    border: `1px solid ${isDarkMode ? '#334155' : '#f1f3f5'}`,
  },

  tabBtn: {
    padding: '10px 24px',
    borderRadius: '40px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s',
  },

  contentArea: {
    minHeight: '400px',
  },

  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },

  sectionIcon: {
    fontSize: '24px',
  },

  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },

  glassCard: {
    background: isDarkMode ? '#1e293b' : '#ffffff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: isDarkMode ? '0 4px 20px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
    marginBottom: '24px',
    border: `1px solid ${isDarkMode ? '#334155' : '#f1f3f5'}`,
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },

  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    margin: 0,
  },

  cardSubtitle: {
    fontSize: '13px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    margin: '4px 0 0 0',
  },

  cardBody: {
    maxHeight: '500px',
    overflowY: 'auto',
  },

  addBtn: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },

  subjectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },

 
  subjectCard: {
  background: isDarkMode ? '#1e293b' : '#ffffff',
  borderRadius: '16px',
  padding: '20px',
  transition: 'transform 0.3s',
  border: `1px solid ${isDarkMode ? '#334155' : '#f1f3f5'}`,
  boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.04)',
},
  subjectCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },

  subjectName: {
    fontSize: '16px',
    fontWeight: '600',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
    margin: '0 0 8px 0',
  },

  weakChip: {
    background: '#fef3c7',
    color: '#d97706',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
  },

  goodChip: {
    background: '#d1fae5',
    color: '#059669',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
  },

  iconBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '8px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
  },

  progressWrapper: {
    marginBottom: '16px',
  },

  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    marginBottom: '8px',
  },

  progressTrack: {
    height: '8px',
    background: isDarkMode ? '#334155' : '#e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981, #059669)',
    borderRadius: '10px',
    transition: 'width 0.3s',
  },

  editForm: {
    padding: '8px 0',
  },

  editInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    border: '2px solid #10b981',
    borderRadius: '10px',
    fontSize: '14px',
    background: isDarkMode ? '#0f172a' : 'white',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    fontSize: '13px',
    cursor: 'pointer',
    color: isDarkMode ? '#e2e8f0' : '#1e293b',
  },

  confidenceControl: {
    marginBottom: '16px',
    padding: '12px',
    background: isDarkMode ? '#0f172a' : '#f3f4f6',
    borderRadius: '10px',
  },

  confidenceBtns: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },

  minusBtn: {
    background: '#ef4444',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    color: 'white',
  },

  plusBtn: {
    background: '#10b981',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    color: 'white',
  },

  slider: {
    width: '100%',
    marginTop: '8px',
  },

  editActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },

  saveBtn: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  cancelBtn: {
    background: '#9ca3af',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
  },

  floatingButtons: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 999,
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },

  floatingBtn: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
  },

  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  loadingText: {
    color: 'white',
    marginTop: '16px',
  },
});

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #10b981;
    border-radius: 10px;
  }

  .floatingBtn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
  }

  @media (max-width: 640px) {
    .floatingButtons {
      flex-direction: column !important;
      bottom: 12px !important;
      right: 12px !important;
      gap: 8px !important;
    }
    .floatingBtn {
      padding: 8px 16px !important;
      font-size: 12px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Dashboard;