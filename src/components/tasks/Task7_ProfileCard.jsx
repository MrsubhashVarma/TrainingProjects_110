export function ProfileCard({ profileImage, name, role, location }) {
  const defaultImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  const avatar = profileImage || defaultImage;

  return (
    <div className="task-component-card profile-card">
      <div className="profile-img-container">
        <img src={avatar} alt={name} className="profile-img" />
      </div>
      <h3 className="card-title">{name}</h3>
      <p className="role-text">{role}</p>
      <p className="location-text">📍 {location}</p>
    </div>
  );
}
