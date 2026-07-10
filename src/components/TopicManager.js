import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TopicManager({ subject, onTopicUpdate, isDarkMode }) {
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicHours, setNewTopicHours] = useState(2);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getTopicSuggestions = (subjectName) => {
    const suggestionsMap = {
      'python': [
        'Variables and Data Types',
        'Control Flow (if/else, loops)',
        'Functions and Modules',
        'Lists and Dictionaries',
        'Object Oriented Programming',
        'File Handling',
        'Exception Handling',
        'Regular Expressions',
        'Python Libraries (NumPy, Pandas)',
        'Web Scraping with BeautifulSoup',
        'API Integration',
        'Database Connection (SQLite/PostgreSQL)'
      ],
      'javascript': [
        'Variables (let, const, var)',
        'Functions and Arrow Functions',
        'Arrays and Objects',
        'DOM Manipulation',
        'Events and Event Listeners',
        'Promises and Async/Await',
        'Fetch API and AJAX',
        'ES6+ Features',
        'Local Storage and Session Storage',
        'Error Handling',
        'Modules and Imports'
      ],
      'react': [
        'Components and Props',
        'State and Lifecycle',
        'Hooks (useState, useEffect)',
        'Event Handling',
        'Conditional Rendering',
        'Lists and Keys',
        'Forms and Controlled Components',
        'React Router',
        'Context API',
        'Redux Basics',
        'API Calls with Axios',
        'Custom Hooks'
      ],
      'frontend': [
        'HTML5 Semantics',
        'CSS3 Flexbox and Grid',
        'Responsive Design',
        'JavaScript ES6+',
        'React.js Fundamentals',
        'State Management',
        'API Integration',
        'Performance Optimization',
        'Cross-Browser Compatibility',
        'Web Accessibility',
        'Build Tools (Webpack, Vite)',
        'CSS Frameworks (Tailwind, Bootstrap)'
      ],
      'backend': [
        'API Design (RESTful)',
        'Authentication & Authorization',
        'Database Design',
        'Server Setup (Node.js/Django)',
        'Middleware and Routing',
        'Error Handling',
        'File Uploads',
        'Caching Strategies',
        'Web Security (CORS, XSS)',
        'WebSockets',
        'Microservices Basics',
        'Logging and Monitoring'
      ],
      'django': [
        'Django Project Setup',
        'Models and Migrations',
        'Views and URL Routing',
        'Django Templates',
        'Forms and Validation',
        'Authentication System',
        'Django REST Framework',
        'Admin Panel Customization',
        'Middleware',
        'Signals',
        'Deployment (Heroku/AWS)',
        'Testing in Django'
      ],
      'database': [
        'Database Design Principles',
        'SQL Queries (SELECT, JOIN)',
        'Indexes and Performance',
        'Normalization and Denormalization',
        'Transactions and ACID',
        'Stored Procedures',
        'Database Backup and Recovery',
        'NoSQL vs SQL',
        'MongoDB Basics',
        'PostgreSQL Features',
        'Database Security',
        'Connection Pooling'
      ],
      'sql': [
        'Basic Queries (SELECT, WHERE)',
        'Joins (INNER, LEFT, RIGHT)',
        'GROUP BY and Aggregation',
        'Subqueries and CTEs',
        'Indexes and Optimization',
        'Views and Materialized Views',
        'Stored Procedures',
        'Triggers',
        'Transactions',
        'Database Normalization',
        'SQL Injection Prevention'
      ],
      'devops': [
        'Version Control (Git/GitHub)',
        'CI/CD Pipelines',
        'Docker Basics',
        'Container Orchestration (Kubernetes)',
        'Cloud Platforms (AWS, GCP, Azure)',
        'Infrastructure as Code (Terraform)',
        'Monitoring and Logging (Prometheus)',
        'Linux System Administration',
        'Shell Scripting',
        'Configuration Management (Ansible)',
        'Load Balancing',
        'Security Best Practices'
      ],
      'docker': [
        'Docker Installation',
        'Dockerfile Creation',
        'Docker Compose',
        'Image Management',
        'Container Networking',
        'Volume Management',
        'Docker Registry',
        'Multi-container Applications',
        'Docker Swarm',
        'Best Practices'
      ],
      'git': [
        'Git Basics (init, add, commit)',
        'Branching and Merging',
        'Remote Repositories',
        'Pull Requests',
        'Conflict Resolution',
        'Git Workflows (GitFlow)',
        'Rebasing',
        'Stashing',
        'Git Hooks',
        'Undoing Changes'
      ]
    };

    const lowerSubject = subjectName.toLowerCase();
    for (const [keyword, suggestions] of Object.entries(suggestionsMap)) {
      if (lowerSubject.includes(keyword)) {
        return suggestions;
      }
    }
    
    return [
      'Introduction and Basics',
      'Core Concepts',
      'Advanced Topics',
      'Practical Applications',
      'Best Practices',
      'Common Pitfalls',
      'Project Work',
      'Revision and Practice'
    ];
  };

  useEffect(() => {
    if (newTopicName.length > 0) {
      const allSuggestions = getTopicSuggestions(subject.name);
      const filtered = allSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(newTopicName.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newTopicName, subject.name]);

  const fetchTopics = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.get(`http://localhost:8000/api/topics/?subject=${subject.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subject && subject.id) {
      fetchTopics();
    }
  }, [subject.id]);

  const addTopic = async (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    
    const token = localStorage.getItem('access_token');
    try {
      await axios.post('http://localhost:8000/api/topics/', {
        name: newTopicName,
        subject: subject.id,
        hours_needed: newTopicHours,
        confidence: 50,
        is_completed: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTopicName('');
      setNewTopicHours(2);
      setShowAddForm(false);
      setSuggestions([]);
      setShowSuggestions(false);
      fetchTopics();
      if (onTopicUpdate) onTopicUpdate();
    } catch (error) {
      console.error('Error adding topic:', error);
      alert('Failed to add topic');
    }
  };

  const deleteTopic = async (topicId, topicName) => {
    if (window.confirm(`Delete "${topicName}"?`)) {
      const token = localStorage.getItem('access_token');
      try {
        await axios.delete(`http://localhost:8000/api/topics/${topicId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTopics();
        if (onTopicUpdate) onTopicUpdate();
      } catch (error) {
        console.error('Error deleting topic:', error);
        alert('Failed to delete topic');
      }
    }
  };

  const updateConfidence = async (topicId, newConfidence) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.patch(`http://localhost:8000/api/topics/${topicId}/`, {
        confidence: newConfidence
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTopics();
      if (onTopicUpdate) onTopicUpdate();
    } catch (error) {
      console.error('Error updating confidence:', error);
    }
  };

  const toggleComplete = async (topicId, currentStatus) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.patch(`http://localhost:8000/api/topics/${topicId}/`, {
        is_completed: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTopics();
      if (onTopicUpdate) onTopicUpdate();
    } catch (error) {
      console.error('Error updating topic status:', error);
    }
  };

  const selectSuggestion = (suggestion) => {
    setNewTopicName(suggestion);
    setShowSuggestions(false);
  };

  if (loading) return <div style={styles(isDarkMode).loading}>Loading topics...</div>;

  const s = styles(isDarkMode);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <h4 style={s.headerTitle}>📖 Topics in {subject.name}</h4>
        <button onClick={() => setShowAddForm(!showAddForm)} style={s.addTopicBtn}>
          {showAddForm ? '− Cancel' : '+ Add Topic'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={addTopic} style={s.form}>
          <div style={s.inputWrapper}>
            <input
              type="text"
              placeholder={`e.g., ${getTopicSuggestions(subject.name)[0] || 'Enter topic name'}`}
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              style={s.input}
              required
              autoFocus
            />
            {showSuggestions && suggestions.length > 0 && (
              <div style={s.suggestionsDropdown}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={s.suggestionItem}
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    💡 {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={s.formRow}>
            <input
              type="number"
              placeholder="Hours"
              value={newTopicHours}
              onChange={(e) => setNewTopicHours(e.target.value)}
              style={s.inputSmall}
              min="1"
              max="20"
            />
            <button type="submit" style={s.saveBtn}>Add Topic</button>
          </div>
        </form>
      )}

      <div style={s.topicList}>
        {topics.length === 0 ? (
          <div style={s.noTopics}>
            <p>📭 No topics yet.</p>
            <p style={s.hint}>Click "+ Add Topic" and try these suggestions:</p>
            <div style={s.suggestionChips}>
              {getTopicSuggestions(subject.name).slice(0, 4).map((suggestion, idx) => (
                <button
                  key={idx}
                  style={s.chip}
                  onClick={() => {
                    setNewTopicName(suggestion);
                    setShowAddForm(true);
                  }}
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          topics.map((topic) => (
            <div key={topic.id} style={s.topicCard}>
              <div style={s.topicHeader}>
                <div style={s.topicTitle}>
                  <input
                    type="checkbox"
                    checked={topic.is_completed}
                    onChange={() => toggleComplete(topic.id, topic.is_completed)}
                    style={s.checkbox}
                  />
                  <span style={topic.is_completed ? s.completed : s.incomplete}>
                    {topic.name}
                  </span>
                  <span style={s.hoursBadge}>{topic.hours_needed} hrs</span>
                </div>
                <button onClick={() => deleteTopic(topic.id, topic.name)} style={s.deleteBtn}>
                  🗑️
                </button>
              </div>
              
              <div style={s.confidenceSection}>
                <div style={s.confidenceLabel}>
                  <label>📊 Confidence Level</label>
                  <span style={s.confidenceValue}>{topic.confidence}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={topic.confidence}
                  onChange={(e) => updateConfidence(topic.id, parseInt(e.target.value))}
                  style={s.slider}
                />
                <div style={s.confidenceButtons}>
                  <button onClick={() => updateConfidence(topic.id, Math.max(0, topic.confidence - 10))} style={s.minusBtn}>
                    -10%
                  </button>
                  <button onClick={() => updateConfidence(topic.id, Math.min(100, topic.confidence + 10))} style={s.plusBtn}>
                    +10%
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = (isDarkMode) => ({
  container: {
    marginTop: '15px',
    padding: '10px',
    background: isDarkMode ? '#0f172a' : '#f8f9fa',
    borderRadius: '8px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e9ecef'}`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  headerTitle: {
    margin: 0,
    color: isDarkMode ? '#e2e8f0' : '#495057',
    fontSize: '14px',
  },
  addTopicBtn: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  form: {
    marginBottom: '15px',
    padding: '10px',
    background: isDarkMode ? '#1e293b' : 'white',
    borderRadius: '5px',
    border: `1px solid ${isDarkMode ? '#334155' : '#dee2e6'}`,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: '10px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: `1px solid ${isDarkMode ? '#475569' : '#dee2e6'}`,
    borderRadius: '5px',
    fontSize: '13px',
    background: isDarkMode ? '#0f172a' : 'white',
    color: isDarkMode ? '#e2e8f0' : '#333',
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: isDarkMode ? '#1e293b' : 'white',
    border: `1px solid ${isDarkMode ? '#475569' : '#dee2e6'}`,
    borderTop: 'none',
    borderRadius: '0 0 5px 5px',
    zIndex: 1000,
    maxHeight: '200px',
    overflowY: 'auto',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  suggestionItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f0f0f0'}`,
    color: isDarkMode ? '#e2e8f0' : '#333',
  },
  formRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  inputSmall: {
    width: '80px',
    padding: '8px',
    border: `1px solid ${isDarkMode ? '#475569' : '#dee2e6'}`,
    borderRadius: '5px',
    fontSize: '13px',
    background: isDarkMode ? '#0f172a' : 'white',
    color: isDarkMode ? '#e2e8f0' : '#333',
  },
  saveBtn: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  topicList: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  topicCard: {
    background: isDarkMode ? '#0f172a' : 'white',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: `1px solid ${isDarkMode ? '#334155' : '#e9ecef'}`,
  },
  topicHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  topicTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  completed: {
    textDecoration: 'line-through',
    color: isDarkMode ? '#64748b' : '#adb5bd',
    fontSize: '13px',
  },
  incomplete: {
    fontWeight: '500',
    fontSize: '13px',
    color: isDarkMode ? '#e2e8f0' : '#333',
  },
  hoursBadge: {
    background: '#667eea',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '10px',
    fontSize: '10px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px',
    opacity: 0.6,
    color: isDarkMode ? '#94a3b8' : '#333',
  },
  confidenceSection: {
    marginTop: '8px',
  },
  confidenceLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '11px',
    color: isDarkMode ? '#94a3b8' : '#495057',
  },
  confidenceValue: {
    fontWeight: 'bold',
    color: '#667eea',
  },
  slider: {
    width: '100%',
    margin: '5px 0',
  },
  confidenceButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '5px',
  },
  minusBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '10px',
  },
  plusBtn: {
    background: '#28a745',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '10px',
  },
  noTopics: {
    textAlign: 'center',
    padding: '20px',
    color: isDarkMode ? '#94a3b8' : '#6c757d',
  },
  hint: {
    fontSize: '11px',
    marginTop: '8px',
    color: isDarkMode ? '#64748b' : '#adb5bd',
  },
  suggestionChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px',
    justifyContent: 'center',
  },
  chip: {
    background: isDarkMode ? '#334155' : '#e9ecef',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '11px',
    cursor: 'pointer',
    color: isDarkMode ? '#e2e8f0' : '#495057',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '12px',
    color: isDarkMode ? '#94a3b8' : '#6c757d',
  },
});

export default TopicManager;