export function MarkStatus({ marks }) {
  const isPass = marks >= 35;
  return (
    <div className={`status-badge-container ${isPass ? 'pass' : 'fail'}`}>
      <span className="marks-badge">{marks}</span>
      <span className="status-text">{isPass ? 'Pass' : 'Fail'}</span>
    </div>
  );
}
