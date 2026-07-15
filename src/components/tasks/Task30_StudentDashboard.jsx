import { useState } from 'react';

// Reusable StudentCard for the Dashboard
function DashboardStudentCard({ student, onToggleAttendance, onUpdateMarks, onDelete }) {
  const isPass = student.marks >= 35;
  const isTopper = student.marks > 90;

  return (
    <div className={`dashboard-student-card ${isTopper ? 'topper-border' : ''}`}>
      {isTopper && <div className="card-ribbon">🏆 TOPPER</div>}
      <div className="student-header">
        <div className="student-avatar-large">
          {student.name.charAt(0)}
        </div>
        <div className="student-title">
          <h4>{student.name}</h4>
          <p>{student.course}</p>
        </div>
        <button className="delete-btn" onClick={() => onDelete(student.id)} title="Delete Student">×</button>
      </div>

      <div className="student-body">
        <div className="student-stat">
          <span className="stat-label">Age:</span>
          <span className="stat-value">{student.age}</span>
        </div>
        
        <div className="student-stat">
          <span className="stat-label">Marks:</span>
          <div className="marks-controller">
            <button className="small-adjust-btn" onClick={() => onUpdateMarks(student.id, student.marks - 5)}>-</button>
            <span className={`marks-display ${isPass ? 'text-pass' : 'text-fail'}`}>
              {student.marks}/100
            </span>
            <button className="small-adjust-btn" onClick={() => onUpdateMarks(student.id, student.marks + 5)}>+</button>
          </div>
        </div>

        <div className="student-badges">
          <span className={`badge ${isPass ? 'badge-success' : 'badge-danger'}`}>
            {isPass ? 'Pass' : 'Fail'}
          </span>
          <span 
            className={`badge attendance-badge ${student.isPresent ? 'badge-present' : 'badge-absent'}`}
            onClick={() => onToggleAttendance(student.id)}
            title="Click to toggle attendance"
            style={{ cursor: 'pointer' }}
          >
            <span className="dot"></span>
            {student.isPresent ? 'Present' : 'Absent'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Aarav Sharma', age: 20, course: 'Computer Science', marks: 95, isPresent: true },
    { id: 2, name: 'Ananya Patel', age: 21, course: 'Data Science', marks: 88, isPresent: true },
    { id: 3, name: 'Kabir Singh', age: 22, course: 'Information Technology', marks: 32, isPresent: false },
    { id: 4, name: 'Diya Sen', age: 19, course: 'AI & Machine Learning', marks: 92, isPresent: true },
    { id: 5, name: 'Rohan Verma', age: 20, course: 'Mechanical Engineering', marks: 45, isPresent: true },
  ]);

  const [filter, setFilter] = useState('all'); // all, pass, fail, toppers
  const [newStudent, setNewStudent] = useState({ name: '', age: '', course: '', marks: '', isPresent: true });
  const [showAddForm, setShowAddForm] = useState(false);

  // Statistics
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.isPresent).length;
  const passedCount = students.filter(s => s.marks >= 35).length;
  const avgMarks = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + curr.marks, 0) / totalStudents) 
    : 0;

  const handleToggleAttendance = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, isPresent: !s.isPresent } : s));
  };

  const handleUpdateMarks = (id, newMarks) => {
    const clampedMarks = Math.max(0, Math.min(100, newMarks));
    setStudents(students.map(s => s.id === id ? { ...s, marks: clampedMarks } : s));
  };

  const handleDelete = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.age || !newStudent.course || newStudent.marks === '') return;

    const studentObj = {
      id: Date.now(),
      name: newStudent.name,
      age: parseInt(newStudent.age),
      course: newStudent.course,
      marks: Math.max(0, Math.min(100, parseInt(newStudent.marks))),
      isPresent: newStudent.isPresent
    };

    setStudents([...students, studentObj]);
    setNewStudent({ name: '', age: '', course: '', marks: '', isPresent: true });
    setShowAddForm(false);
  };

  const filteredStudents = students.filter(s => {
    if (filter === 'pass') return s.marks >= 35;
    if (filter === 'fail') return s.marks < 35;
    if (filter === 'toppers') return s.marks > 90;
    return true;
  });

  return (
    <div className="student-dashboard-wrapper">
      <div className="dashboard-header-row">
        <div>
          <h2>Student Management Dashboard</h2>
          <p className="subtitle">Track metrics, manage attendance, and monitor performance in real-time.</p>
        </div>
        <button 
          className="custom-btn btn-primary btn-add-student"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '＋ Add Student'}
        </button>
      </div>

      {showAddForm && (
        <form className="add-student-form glass-card animate-slide-down" onSubmit={handleAddStudent}>
          <h3>Add New Student</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                placeholder="Student Name"
                value={newStudent.name}
                onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" 
                placeholder="Age"
                min="1"
                max="100"
                value={newStudent.age}
                onChange={e => setNewStudent({ ...newStudent, age: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Course</label>
              <input 
                type="text" 
                placeholder="Course Name"
                value={newStudent.course}
                onChange={e => setNewStudent({ ...newStudent, course: e.target.value })}
                required 
              />
            </div>
            <div className="form-group">
              <label>Marks (0-100)</label>
              <input 
                type="number" 
                placeholder="Marks"
                min="0"
                max="100"
                value={newStudent.marks}
                onChange={e => setNewStudent({ ...newStudent, marks: e.target.value })}
                required 
              />
            </div>
          </div>
          
          <div className="form-footer">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={newStudent.isPresent}
                onChange={e => setNewStudent({ ...newStudent, isPresent: e.target.checked })}
              />
              Mark as Present
            </label>
            <button type="submit" className="custom-btn btn-success">Save Student</button>
          </div>
        </form>
      )}

      {/* Stats Counter Section */}
      <div className="stats-dashboard-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-number">{totalStudents}</span>
            <span className="stat-label">Total Students</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon text-present">✓</div>
          <div className="stat-info">
            <span className="stat-number">{presentCount}</span>
            <span className="stat-label">Present Status</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon text-pass">🎓</div>
          <div className="stat-info">
            <span className="stat-number">
              {totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 0}%
            </span>
            <span className="stat-label">Pass Rate</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon text-topper">⭐</div>
          <div className="stat-info">
            <span className="stat-number">{avgMarks}</span>
            <span className="stat-label">Average Marks</span>
          </div>
        </div>
      </div>

      {/* Filter and Content */}
      <div className="filter-row">
        <span className="filter-title">Filters:</span>
        <div className="filter-buttons">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Students
          </button>
          <button 
            className={`filter-tab ${filter === 'pass' ? 'active' : ''}`}
            onClick={() => setFilter('pass')}
          >
            Passed
          </button>
          <button 
            className={`filter-tab ${filter === 'fail' ? 'active' : ''}`}
            onClick={() => setFilter('fail')}
          >
            Failed
          </button>
          <button 
            className={`filter-tab ${filter === 'toppers' ? 'active' : ''}`}
            onClick={() => setFilter('toppers')}
          >
            Toppers (&gt;90)
          </button>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="empty-state glass-card">
          <p>No students match the current filter.</p>
        </div>
      ) : (
        <div className="students-grid">
          {filteredStudents.map(student => (
            <DashboardStudentCard 
              key={student.id} 
              student={student} 
              onToggleAttendance={handleToggleAttendance}
              onUpdateMarks={handleUpdateMarks}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
