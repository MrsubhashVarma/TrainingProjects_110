export function Student({ name, age, course }) {
  return (
    <div className="task-component-card student-prop-card">
      <h3 className="card-title">{name}</h3>
      <p className="card-detail"><strong>Age:</strong> {age}</p>
      <p className="card-detail"><strong>Course:</strong> {course}</p>
    </div>
  );
}
