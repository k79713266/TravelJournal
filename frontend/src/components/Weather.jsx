import { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const getWeatherCondition = (code) => {
  if (code === 0) return "☀️ Clear Sky";
  if (code === 1 || code === 2) return "🌤️ Partly Cloudy";
  if (code === 3) return "☁️ Cloudy";
  if ([45, 48].includes(code)) return "🌫️ Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️ Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "🌧️ Rainy";
  if ([71, 73, 75, 77].includes(code)) return "❄️ Snowy";
  if ([80, 81, 82].includes(code)) return "🌧️ Rain Showers";
  if ([95, 96, 99].includes(code)) return "⛈️ Thunderstorm";

  return "🌤️ Unknown";
};

  const handleSearch = async () => {
  if (!city) {
    alert("Please enter a city");
    return;
  }

  try {
    // Find city coordinates
    const locationResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`
    );

    const locationData = await locationResponse.json();

    if (!locationData.results || locationData.results.length === 0) {
      alert("City not found!");
      return;
    }

    const location = locationData.results[0];

    // Get weather
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
    );

    const weatherData = await weatherResponse.json();

    setWeather({
      city: location.name,
      temperature: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      condition: getWeatherCondition(
  weatherData.current.weather_code
),
    });
  } catch (error) {
    console.error(error);
    alert("Weather fetch nahi ho pa raha.");
  }
};

  return (
    <div className="weather-card">
      <h2>🌤️ Check Weather</h2>

      <div className="weather-search">
        <input
          type="text"
          placeholder="Enter destination..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={handleSearch}>
          Check Weather
        </button>
      </div>

      {weather && (
        <div className="weather-result">
          <h3>📍 {weather.city}</h3>
          <p>🌡️ Temperature: {weather.temperature}°C</p>
          <p>☀️ Condition: {weather.condition}</p>
          <p>💧 Humidity: {weather.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default Weather;