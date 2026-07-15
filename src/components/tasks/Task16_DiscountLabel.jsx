export function DiscountLabel({ discount }) {
  if (discount <= 0) return null;
  return (
    <span className="discount-label-badge">
      ⚡ Save {discount}%
    </span>
  );
}
