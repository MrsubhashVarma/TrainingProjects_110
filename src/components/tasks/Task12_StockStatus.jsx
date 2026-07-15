export function StockStatus({ inStock }) {
  return (
    <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`}>
      {inStock ? 'Available' : 'Out of Stock'}
    </span>
  );
}
