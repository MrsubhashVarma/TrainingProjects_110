export function ProductCard({ name, price, category }) {
  return (
    <div className="task-component-card product-card">
      <div className="product-image-placeholder">📦</div>
      <h3 className="card-title">{name}</h3>
      <p className="card-detail"><strong>Category:</strong> {category}</p>
      <p className="price">${price.toFixed(2)}</p>
    </div>
  );
}
