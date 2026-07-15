export function ProductCardSale({ name, price, category, onSale = false }) {
  return (
    <div className="task-component-card product-card">
      <div className="product-image-placeholder">📦</div>
      <div className="card-header">
        <h3 className="card-title">{name}</h3>
        <div className="badge-row">
          {onSale && <span className="badge badge-sale">Sale 🔥</span>}
        </div>
      </div>
      <p className="card-detail"><strong>Category:</strong> {category}</p>
      <p className="price">${price.toFixed(2)}</p>
    </div>
  );
}
