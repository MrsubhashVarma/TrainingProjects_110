export function AgeStatus({ age }) {
  const isAdult = age >= 18;
  return (
    <div className={`age-badge-box ${isAdult ? 'adult' : 'minor'}`}>
      {isAdult ? 'Adult (18+)' : 'Minor'}
    </div>
  );
}
