export function StudentList({ students }) {
  if (!students || students.length === 0) {
    return <p className="no-data">No students available.</p>;
  }
  return (
    <div className="student-list-container">
      {students.map((student, idx) => (
        <div key={idx} className="student-list-item">
          <div className="student-avatar-letter">{student.name.charAt(0)}</div>
          <div className="student-info">
            <h4 className="student-name">{student.name}</h4>
            <p className="student-meta">Age: {student.age} | Course: {student.course}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
