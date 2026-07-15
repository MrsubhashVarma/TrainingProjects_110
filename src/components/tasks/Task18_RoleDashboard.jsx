export function RoleDashboard({ role }) {
  const isAdmin = role === 'Admin';
  return (
    <div className={`dashboard-box ${isAdmin ? 'admin-theme' : 'user-theme'}`}>
      <h4>{isAdmin ? '🛡️ Admin Panel' : '👤 User Dashboard'}</h4>
      <p>{isAdmin ? 'Full system permissions granted.' : 'Standard read-only user access.'}</p>
    </div>
  );
}
