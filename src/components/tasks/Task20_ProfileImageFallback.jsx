export function ProfileImageFallback({ profileImage, name }) {
  const defaultImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  const avatar = profileImage || defaultImage;

  return (
    <div className="profile-img-container">
      <img src={avatar} alt={name || "User Avatar"} className="profile-img" />
    </div>
  );
}
