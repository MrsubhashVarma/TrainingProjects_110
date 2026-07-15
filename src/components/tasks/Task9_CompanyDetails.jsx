export function CompanyDetails({ company }) {
  if (!company) return null;
  return (
    <div className="task-component-card company-card">
      <h3 className="card-title">{company.name}</h3>
      <div className="company-info-grid">
        <div className="info-cell">
          <strong>Industry:</strong> {company.industry}
        </div>
        <div className="info-cell">
          <strong>CEO:</strong> {company.ceo}
        </div>
        <div className="info-cell">
          <strong>Employees:</strong> {company.employees.toLocaleString()}
        </div>
        <div className="info-cell">
          <strong>Location:</strong> {company.headquarters}
        </div>
      </div>
    </div>
  );
}
