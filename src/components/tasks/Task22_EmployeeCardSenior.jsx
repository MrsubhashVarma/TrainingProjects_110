export function EmployeeCardSenior({ name, designation, salary, department, experience = 0 }) {
  return (
    <div className="task-component-card employee-card">
      <div className="card-header">
        <h3 className="card-title">{name}</h3>
        {experience > 5 && <span className="badge badge-senior">Senior Employee</span>}
      </div>
      <p className="card-detail"><strong>Designation:</strong> {designation}</p>
      <p className="card-detail"><strong>Department:</strong> {department}</p>
      <p className="card-detail"><strong>Salary:</strong> ${salary.toLocaleString()}</p>
      <p className="card-detail"><strong>Experience:</strong> {experience} {experience === 1 ? 'year' : 'years'}</p>
    </div>
  );
}
