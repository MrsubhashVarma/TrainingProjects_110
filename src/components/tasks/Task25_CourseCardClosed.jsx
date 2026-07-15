export function CourseCardClosed({ courseName, trainer, duration, fee, seatsFull = false }) {
  return (
    <div className="task-component-card course-card">
      <div className="card-header">
        <h3 className="card-title">{courseName}</h3>
        {seatsFull ? (
          <span className="badge badge-closed">Enrollment Closed</span>
        ) : (
          <span className="badge badge-success">Open for Enrollment</span>
        )}
      </div>
      <p className="card-detail"><strong>Trainer:</strong> {trainer}</p>
      <p className="card-detail"><strong>Duration:</strong> {duration}</p>
      <p className="price">${fee}</p>
    </div>
  );
}
