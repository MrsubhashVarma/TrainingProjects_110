export function MovieCardBlockbuster({ title, poster, rating, genre }) {
  return (
    <div className="task-component-card movie-card">
      <div className="movie-poster">{poster || '🎬'}</div>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {rating > 8.5 && <span className="badge badge-blockbuster">Blockbuster 🏆</span>}
      </div>
      <p className="card-detail"><strong>Genre:</strong> {genre}</p>
      <p className="card-detail rating-detail">
        <strong>Rating:</strong> <span className="rating-star">⭐</span> {rating}/10
      </p>
    </div>
  );
}
