export function WeatherCardIcon({ city, temperature, condition }) {
  const getWeatherIcon = () => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return '☀️';
      case 'rainy':
        return '🌧️';
      case 'cloudy':
        return '☁️';
      default:
        return '⛅';
    }
  };

  return (
    <div className={`task-component-card weather-card ${condition.toLowerCase()}`}>
      <div className="weather-icon">{getWeatherIcon()}</div>
      <h3 className="card-title">{city}</h3>
      <p className="temp">{temperature}°C</p>
      <p className="condition">{condition}</p>
    </div>
  );
}
