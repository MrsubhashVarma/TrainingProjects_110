export function MovieCard({ title, poster, rating, genre }) {
  return (
    <div className="task-component-card movie-card">
      <div className="movie-poster">{poster || '🎬'}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-detail"><strong>Genre:</strong> {genre}</p>
      <p className="card-detail rating-detail">
        <strong>Rating:</strong> <span className="rating-star">⭐</span> {rating}/10
      </p>
    </div>
  );
}
