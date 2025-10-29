import React from "react";

/**
 * Map Open-Meteo weather codes to human readable text and emoji
 * (simplified, covers common cases)
 */
function weatherCodeToText(code) {
  const map = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Fog", "🌫️"],
    48: ["Depositing rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Moderate drizzle", "🌧️"],
    55: ["Dense drizzle", "🌧️"],
    56: ["Freezing drizzle", "🧊"],
    57: ["Dense freezing drizzle", "🧊"],
    61: ["Slight rain", "🌧️"],
    63: ["Moderate rain", "🌧️"],
    65: ["Heavy rain", "⛈️"],
    66: ["Freezing rain", "🧊"],
    67: ["Heavy freezing rain", "🧊"],
    71: ["Slight snow", "🌨️"],
    73: ["Moderate snow", "🌨️"],
    75: ["Heavy snow", "❄️"],
    80: ["Rain showers", "🌧️"],
    81: ["Moderate rain showers", "🌧️"],
    82: ["Violent rain showers", "⛈️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with slight hail", "⛈️"],
    99: ["Thunderstorm with heavy hail", "⛈️"],
  };

  return map[code] || ["Unknown", "❓"];
}

export default function WeatherCard({ data }) {
  const w = data.weather;
  const [desc, emoji] = weatherCodeToText(w.weathercode);

  // Open-Meteo current_weather returns temperature in Celsius and windspeed in km/h
  return (
    <div
      className="card"
      role="region"
      aria-label={`Weather for ${data.place}`}
    >
      <div className="left">
        <div style={{ fontSize: 36 }}>{emoji}</div>
        <div className="meta small">{data.place}</div>
      </div>

      <div className="info">
        <div className="temp">{Math.round(w.temperature)}°C</div>
        <div className="meta">
          {desc} • observed at {w.time}
        </div>

        <div className="details">
          <div>
            Wind: <strong>{w.windspeed} km/h</strong>
          </div>
          <div>
            Wind dir: <strong>{w.winddirection}°</strong>
          </div>
          <div>
            Weather Code: <strong>{w.weathercode}</strong>
          </div>
        </div>

        <div style={{ marginTop: 10 }} className="small">
          Coordinates: {data.lat.toFixed(3)}, {data.lon.toFixed(3)}
        </div>
      </div>
    </div>
  );
}
