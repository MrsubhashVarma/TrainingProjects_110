export function CourseCard({ courseName, trainer, duration, fee }) {
  return (
    <div className="task-component-card course-card">
      <h3 className="card-title">{courseName}</h3>
      <p className="card-detail"><strong>Trainer:</strong> {trainer}</p>
      <p className="card-detail"><strong>Duration:</strong> {duration}</p>
      <p className="price">${fee}</p>
    </div>
  );
}
