export function EmployeeCard({ name, designation, salary, department }) {
  return (
    <div className="task-component-card employee-card">
      <div className="card-header">
        <h3 className="card-title">{name}</h3>
      </div>
      <p className="card-detail"><strong>Designation:</strong> {designation}</p>
      <p className="card-detail"><strong>Department:</strong> {department}</p>
      <p className="card-detail"><strong>Salary:</strong> ${salary.toLocaleString()}</p>
    </div>
  );
}
