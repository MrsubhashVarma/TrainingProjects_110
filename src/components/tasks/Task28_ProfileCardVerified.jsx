export function ProfileCardVerified({ profileImage, name, role, location, isVerified = false }) {
  const defaultImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  const avatar = profileImage || defaultImage;

  return (
    <div className="task-component-card profile-card">
      <div className="profile-img-container">
        <img src={avatar} alt={name} className="profile-img" />
        {isVerified && <span className="verified-badge" title="Verified User">✓</span>}
      </div>
      <h3 className="card-title">
        {name} {isVerified && <span className="text-verified">(Verified)</span>}
      </h3>
      <p className="role-text">{role}</p>
      <p className="location-text">📍 {location}</p>
    </div>
  );
}
