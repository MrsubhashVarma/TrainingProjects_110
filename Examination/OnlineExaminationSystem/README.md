# Online Examination System (Examify)

A full-stack, responsive, and secure Online Examination System built for educational institutions and organizations. 

## Technology Stack
- **Frontend**: Vanilla HTML5, CSS3 (Slate glassmorphism design), ES6 JavaScript, Fetch API, and `html2pdf.js` (for score card downloads).
- **Backend**: Django Web Framework with Function-Based Views and Django REST Framework APIs.
- **Database**: SQLite3.
- **CORS**: Configured using `django-cors-headers` to enable dynamic frontend-backend communication.

---

## Features & Project Marks Checklist
- **Student Management Module**: Register students, read details, update attributes, and delete records (4 APIs).
- **Examination Management Module**: Manage exams, duration, subject fields, total marks, and exam dates (4 APIs).
- **Question Management Module**: Administer Multiple Choice Questions mapping to exams (4 APIs).
- **Exam Submission Module**: Attempt exams, record answers, auto-compute scores, and create submissions (4 APIs).
- **Result Management Module**: Log score details, percentage, pass/fail status, and query details (4 APIs).
- **Interactive Dashboards**:
  - **Student Dashboard**: Displays exam counters (Registered, Completed, Pending), history tables, and exam schedules.
  - **Admin Dashboard**: Comprehensive control center to manage all databases via inline tables, search filters, and modals.
- **Bonus Features**:
  1. **Countdown Timer**: A circular/numeric visual indicator in the active exam screen.
  2. **Shuffled Questions**: Question order is randomized upon start to prevent cheating.
  3. **Auto-Submit**: Exams are automatically pushed to the backend grading queue when the timer hits `00:00:00`.
  4. **Leaderboard**: Student dashboards list top performers categorized by exam titles.
  5. **Download Result as PDF**: Score certificates can be downloaded as a PDF file in one click.

---

## Folder Structure
```text
OnlineExaminationSystem/
├── Backend/
│   ├── __init__.py
│   ├── asgi.py
│   ├── db.py           <-- Raw SQL SQLite database wrapper
│   ├── settings.py     <-- Django settings & CORS config
│   ├── urls.py         <-- 20 REST API URL routings
│   ├── verify_apis.py  <-- Backend logic validation suite
│   ├── views.py        <-- Function-based REST API views
│   └── wsgi.py
├── Frontend/
│   ├── admin_dashboard.html
│   ├── exam.html
│   ├── exams.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── results.html
│   ├── script.js       <-- Frontend Client API operations
│   ├── student_dashboard.html
│   └── style.css       <-- Slate design system stylesheet
├── db.sqlite3          <-- SQLite database storage file
└── manage.py           <-- Django manager utility
```

---

## System Configuration & Installation

### Prerequisites
Make sure **Python 3.8+** is installed on your computer.

### Step 1: Install Dependencies
Open your command terminal and install Django, Django CORS Headers, and Django REST Framework:
```bash
pip install django django-cors-headers djangorestframework
```

### Step 2: Initialize Database and Run Verification Tests
A self-contained testing suite is included to verify the database configuration:
```bash
python Backend/verify_apis.py
```
This automatically initializes the SQLite schema, populates it with sample testing records, performs test additions, reads columns, and cleans up temporary records.

### Step 3: Run the Backend Django Server
Start the development server using Django:
```bash
python manage.py runserver
```
The server will boot up at: `http://127.0.0.1:8000/`. Keep this terminal window open.

### Step 4: Launch the Frontend
Double-click `Frontend/index.html` to open it in your browser, or serve it locally.

---

## Default User Accounts (Mock Seeding)
The system is pre-populated with default student and admin records for testing:

### 1. Student Access
- **Email**: `rahul@gmail.com`
- **Password**: `rahul123`
- *Profile Details*: Rahul Sharma | ABC Engineering College | Student ID: `101`

### 2. Administrator Access
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

---

## Django REST API Endpoints Map (20 APIs)

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Students** | `POST` | `/students/add/` | Register new student profile |
| | `GET` | `/students/` | Fetch all registered student accounts |
| | `PUT` | `/students/update/<id>/` | Edit student credentials |
| | `DELETE`| `/students/delete/<id>/` | Remove student account |
| **Exams** | `POST` | `/exams/add/` | Create new exam schedule |
| | `GET` | `/exams/` | Fetch all scheduled exams |
| | `PUT` | `/exams/update/<id>/` | Modify exam settings (duration/marks/date) |
| | `DELETE`| `/exams/delete/<id>/` | Remove exam schedule |
| **Questions** | `POST` | `/questions/add/` | Add question with MCQs |
| | `GET` | `/questions/` | Retrieve questions (supports filter: `?exam_title=...`) |
| | `PUT` | `/questions/update/<id>/` | Update question parameters |
| | `DELETE`| `/questions/delete/<id>/` | Delete question |
| **Submissions**| `POST` | `/submissions/add/` | Submit answers (auto-calculates grades & logs results) |
| | `GET` | `/submissions/` | Fetch all student papers |
| | `PUT` | `/submissions/update/<id>/` | Modify submission records |
| | `DELETE`| `/submissions/delete/<id>/` | Remove submission record |
| **Results** | `POST` | `/results/add/` | Add manual grade report |
| | `GET` | `/results/` | Fetch grade reports (supports filters: name, exam) |
| | `PUT` | `/results/update/<id>/` | Edit result card values |
| | `DELETE`| `/results/delete/<id>/` | Delete result card |
| **Auth** | `POST` | `/students/login/` | Custom login credentials verification |
