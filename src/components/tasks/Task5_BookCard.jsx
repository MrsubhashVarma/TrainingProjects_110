export function BookCard({ title, author, price, category }) {
  return (
    <div className="task-component-card book-card">
      <div className="book-icon">📖</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-detail"><strong>Author:</strong> {author}</p>
      <p className="card-detail"><strong>Category:</strong> {category}</p>
      <p className="price">${price.toFixed(2)}</p>
    </div>
  );
}
