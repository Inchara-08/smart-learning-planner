
📚 Smart Learning Planner

A full-stack web application that helps students create personalized study plans, track their learning progress, and stay focused with built-in productivity tools.

✨ Features

- 🔐 **User Authentication** - Secure login and registration with JWT tokens
- 📊 **Interactive Dashboard** - Real-time statistics, subject management, and progress tracking
- 📚 **Smart Study Plan** - AI-powered schedule generation based on weak subjects and confidence levels
- ⏱️ **Pomodoro Timer** - 25-minute focus sessions with break reminders and session tracking
- 📈 **Progress Analytics** - Visual charts showing subject confidence and overall progress
- 🎨 **Dark/Light Mode** - Toggle between themes for comfortable viewing
- 📱 **Fully Responsive** - Works on all devices

 🛠️ Tech Stack

 Frontend
- React.js
- React Router
- Axios
- CSS3

 Backend
- Django
- Django REST Framework
- JWT Authentication
- SQLite3

🚀 Quick Start

Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

Backend Setup

```bash
# Clone the repository
git clone https://github.com/Inchara-08/smart-learning-planner.git
cd smart-learning-planner

# Create virtual environment
python -m venv myenv
myenv\Scripts\activate  # Windows
source myenv/bin/activate  # Mac/Linux

# Install dependencies
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt

# Run migrations
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

# Start backend server
python manage.py runserver
Frontend Setup
bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start React app
npm start
Access the Application
Page     	    URL
Frontend	     http://localhost:3000
Django Admin	 http://localhost:8000/admin
Login	        http://localhost:3000/login
Register	     http://localhost:3000/register

Default Admin Credentials:
Username: admin
Password: admin123

📁 Project Structure
text
smart-learning-planner/
├── backend/
│   ├── api/
│   │   ├── models.py      # Database models
│   │   ├── views.py       # API endpoints
│   │   ├── serializers.py # Data serializers
│   │   └── urls.py        # API routing
│   └── backend/
│       └── settings.py    # Django settings
└── frontend/
    └── src/
        ├── components/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Dashboard.js
        │   ├── Navbar.js
        │   ├── StudyPlan.js
        │   ├── AddSubject.js
        │   ├── TopicManager.js
        │   ├── ProgressChart.js
        │   ├── SmartSchedule.js
        │   ├── PomodoroTimer.js
        │   ├── SearchAndSort.js
        │   └── ExportReport.js
        ├── services/
        │   └── api.js      # API service layer
        └── App.js
🎯 Key Features Explained
1. Smart Study Plan
The application automatically generates a personalized study schedule based on:

Weak subjects (marked by the user)

Confidence levels (0-100%)

Exam dates

Daily available study hours

2. Subject & Topic Management
Add subjects with confidence ratings

Mark subjects as weak for extra focus

Add topics with smart suggestions

Track topic completion

Adjust confidence levels with sliders

3. Pomodoro Timer
25-minute study sessions

5-minute breaks

Tracks daily sessions completed

Progress ring visualization

4. Progress Analytics
Confidence level charts for all subjects

Average confidence calculation

Weak/Strong subject identification

🖼️ Screenshots
Login Page
https://screenshots/login.png

Dashboard
https://screenshots/dashboard.png

Study Plan
https://screenshots/studyplan.png

Dark Mode
https://screenshots/darkmode.png

📦 Dependencies
Backend Dependencies
text
Django==4.2.0
djangorestframework==3.14.0
django-cors-headers==3.14.0
djangorestframework-simplejwt==5.2.2
Frontend Dependencies
text
react: ^18.2.0
react-router-dom: ^6.11.0
axios: ^1.4.0
🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit changes (git commit -m 'Add some AmazingFeature')

Push to branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is open source and available under the MIT License.

👩‍💻 Author
Inchara

GitHub: @Inchara-08

🙏 Acknowledgments
Django REST Framework for the robust API

React community for amazing frontend tools

