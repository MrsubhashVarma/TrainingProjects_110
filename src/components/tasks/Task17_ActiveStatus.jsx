export function ActiveStatus({ isActive }) {
  return (
    <span className={`status-badge ${isActive ? 'online' : 'offline'}`}>
      <span className="dot"></span>
      {isActive ? 'Online' : 'Offline'}
    </span>
  );
}
