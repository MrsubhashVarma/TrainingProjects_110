export function StudentCardTopper({ name, marks }) {
  const isPass = marks >= 35;
  const isTopper = marks > 90;
  return (
    <div className="dashboard-student-card" style={{ border: isTopper ? '1px solid var(--accent-amber)' : '1px solid var(--border-color)', width: '100%', maxWidth: '340px' }}>
      {isTopper && <div className="card-ribbon">🏆 TOPPER</div>}
      <div className="student-header" style={{ paddingRight: '40px' }}>
        <div className="student-avatar-large">{name.charAt(0)}</div>
        <div className="student-title">
          <h4>{name}</h4>
          <p>Student Card</p>
        </div>
      </div>
      <div className="student-body">
        <div className="student-stat">
          <span className="stat-label">Marks Score:</span>
          <span className="stat-value">{marks}/100</span>
        </div>
        <div className="student-badges">
          <span className={`badge ${isPass ? 'badge-success' : 'badge-danger'}`}>
            {isPass ? 'Pass' : 'Fail'}
          </span>
        </div>
      </div>
    </div>
  );
}
