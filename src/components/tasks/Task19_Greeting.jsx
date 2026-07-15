export function Greeting({ customTime }) {
  const getGreeting = () => {
    let hour;
    if (customTime) {
      hour = parseInt(customTime.split(':')[0]);
    } else {
      hour = new Date().getHours();
    }

    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning 🌅', class: 'morning' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon ☀️', class: 'afternoon' };
    } else {
      return { text: 'Good Evening 🌌', class: 'evening' };
    }
  };

  const greeting = getGreeting();
  return (
    <div className={`greeting-badge ${greeting.class}`}>
      {greeting.text}
    </div>
  );
}
