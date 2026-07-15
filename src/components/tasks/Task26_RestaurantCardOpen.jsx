export function RestaurantCardOpen({ name, cuisine, openTime, closeTime, currentTime }) {
  const isOpen = () => {
    if (!currentTime) return true;
    const current = parseInt(currentTime.replace(':', ''));
    const start = parseInt(openTime.replace(':', ''));
    const end = parseInt(closeTime.replace(':', ''));
    return current >= start && current <= end;
  };

  const open = isOpen();

  return (
    <div className="task-component-card restaurant-card">
      <div className="card-header">
        <h3 className="card-title">{name}</h3>
        <span className={`badge ${open ? 'badge-success' : 'badge-danger'}`}>
          {open ? 'Open Now 🟢' : 'Closed 🔴'}
        </span>
      </div>
      <p className="card-detail"><strong>Cuisine:</strong> {cuisine}</p>
      <p className="card-detail"><strong>Hours:</strong> {openTime} - {closeTime}</p>
    </div>
  );
}
