export function Button({ text, onClick, variant = 'primary' }) {
  return (
    <button className={`custom-btn btn-${variant}`} onClick={onClick}>
      {text}
    </button>
  );
}
