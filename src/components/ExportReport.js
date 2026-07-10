import React, { useState } from 'react';
import axios from 'axios';

function ExportReport() {
  const [exporting, setExporting] = useState(false);

  const generatePDF = async () => {
    setExporting(true);
    const token = localStorage.getItem('access_token');
    
    try {
      const subjectsRes = await axios.get('http://localhost:8000/api/subjects/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const topicsRes = await axios.get('http://localhost:8000/api/topics/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const subjects = subjectsRes.data;
      const topics = topicsRes.data;
      
      // Create HTML content for report
      const reportHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Study Progress Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #667eea; }
            h2 { color: #764ba2; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #667eea; color: white; }
            .weak { color: #ff9800; }
            .good { color: #4caf50; }
            .progress-bar { background: #e0e0e0; border-radius: 10px; height: 20px; }
            .progress-fill { background: #4caf50; height: 20px; border-radius: 10px; }
          </style>
        </head>
        <body>
          <h1>📚 Smart Learning Planner - Progress Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          
          <h2>📊 Overall Statistics</h2>
          <ul>
            <li>Total Subjects: ${subjects.length}</li>
            <li>Total Topics: ${topics.length}</li>
            <li>Completed Topics: ${topics.filter(t => t.is_completed).length}</li>
            <li>Average Confidence: ${Math.round(subjects.reduce((sum, s) => sum + s.confidence, 0) / (subjects.length || 1))}%</li>
          </ul>
          
          <h2>📚 Subjects Overview</h2>
          <table>
            <tr>
              <th>Subject</th>
              <th>Status</th>
              <th>Confidence</th>
              <th>Progress</th>
            </tr>
            ${subjects.map(subject => `
              <tr>
                <td>${subject.name}</td>
                <td class="${subject.is_weak ? 'weak' : 'good'}">${subject.is_weak ? '⚠️ Needs Attention' : '✅ Good'}</td>
                <td>${subject.confidence}%</td>
                <td>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${subject.confidence}%"></div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </table>
          
          <h2>📖 Topics Details</h2>
          <table>
            <tr>
              <th>Topic</th>
              <th>Confidence</th>
              <th>Status</th>
            </tr>
            ${topics.map(topic => `
              <tr>
                <td>${topic.name}</td>
                <td>${topic.confidence}%</td>
                <td>${topic.is_completed ? '✅ Completed' : '⏳ In Progress'}</td>
              </tr>
            `).join('')}
          </table>
          
          <footer style="margin-top: 50px; text-align: center; color: #999;">
            <p>Keep studying! You're doing great! 🎉</p>
          </footer>
        </body>
        </html>
      `;
      
      // Create blob and download
      const blob = new Blob([reportHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `study-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('✅ Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('❌ Failed to generate report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button onClick={generatePDF} disabled={exporting} style={styles.button}>
      {exporting ? '📄 Generating...' : '📥 Export Report as HTML'}
    </button>
  );
}

const styles = {
  button: {
    background: '#17a2b8',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default ExportReport;