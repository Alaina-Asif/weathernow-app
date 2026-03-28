import { useState } from "react";
import "./App.css";

const API_KEY = "a4ee342e818aba0f5ceea074af4a40a1"; // replace this with your key from openweathermap.org

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌫️",
};

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    const trimmed = city.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmed}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const condition = weather?.weather?.[0]?.main || "";
  const icon = weatherIcons[condition] || "🌡️";

  return (
    <div className="wrapper">
      <div className="card">
        <h1 className="app-title">WeatherNow 🌤️</h1>
        <p className="app-sub">Search any city in the world</p>

        <div className="search-row">
          <input
            className="city-input"
            placeholder="e.g. Munich, Lahore, London..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button className="search-btn" onClick={fetchWeather}>Search</button>
        </div>

        {loading && <div className="status-msg">Fetching weather... ⏳</div>}
        {error && <div className="status-msg error">{error} ❌</div>}

        {weather && !loading && (
          <div className="weather-box">
            <div className="city-name">
              {weather.name}, {weather.sys.country}
            </div>

            <div className="weather-icon">{icon}</div>

            <div className="temp">{Math.round(weather.main.temp)}°C</div>
            <div className="condition">{weather.weather[0].description}</div>

            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-val">{Math.round(weather.main.feels_like)}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-val">{weather.main.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind</span>
                <span className="detail-val">{weather.wind.speed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pressure</span>
                <span className="detail-val">{weather.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="placeholder">
            <div className="placeholder-icon">🌍</div>
            <p>Enter a city name to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
