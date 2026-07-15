export function JobCardType({ title, company, type, salary }) {
  const isRemote = type.toLowerCase() === 'remote';
  return (
    <div className="task-component-card job-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span className={`badge ${isRemote ? 'badge-remote' : 'badge-onsite'}`}>
          {isRemote ? '🏠 Remote' : '🏢 On-site'}
        </span>
      </div>
      <p className="card-detail"><strong>Company:</strong> {company}</p>
      <p className="card-detail"><strong>Salary:</strong> {salary}</p>
    </div>
  );
}
