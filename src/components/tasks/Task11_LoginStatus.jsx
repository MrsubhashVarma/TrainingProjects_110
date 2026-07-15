export function LoginStatus({ isLoggedIn }) {
  return (
    <div className={`login-status-box ${isLoggedIn ? 'logged-in' : 'logged-out'}`}>
      <span className="status-indicator"></span>
      {isLoggedIn ? 'Login Successful' : 'Please Login'}
    </div>
  );
}
