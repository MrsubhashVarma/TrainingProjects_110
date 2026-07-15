export function PremiumBadge({ isPremium }) {
  if (!isPremium) return null;
  return (
    <span className="premium-badge-tag">
      👑 Premium Member
    </span>
  );
}
