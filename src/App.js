import React, { useState } from "react";
import WeatherCard from "./WeatherCard";

export default function App() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e?.preventDefault();
    setError("");
    setResult(null);

    const q = city.trim();
    if (!q) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    try {
      // 1) Geocoding: get lat/lon from city name
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        q
      )}&count=1&language=en&format=json`;

      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) throw new Error("Failed to fetch location.");
      const geoJson = await geoRes.json();

      if (!geoJson.results || geoJson.results.length === 0) {
        setError(`City "${q}" not found. Try another city.`);
        setLoading(false);
        return;
      }

      const place = geoJson.results[0];
      const { latitude, longitude, name, country } = place;

      // 2) Weather: fetch current weather
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Failed to fetch weather.");
      const weatherJson = await weatherRes.json();

      if (!weatherJson.current_weather) {
        setError("Weather data is not available for this location.");
        setLoading(false);
        return;
      }

      setResult({
        place: `${name}${country ? ", " + country : ""}`,
        lat: latitude,
        lon: longitude,
        weather: weatherJson.current_weather,
      });
    } catch (err) {
      console.error(err);
      setError("Network error or API failure. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="title">🌤️ Weather Now</div>
        <div className="subtitle">
          Get live weather updates for any city — powered by Open-Meteo API
        </div>
      </div>

      <form className="searchBox" onSubmit={handleSearch}>
        <input
          className="input"
          placeholder="Enter city (e.g., Hyderabad, London, Tokyo)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading && (
        <div className="loading">Fetching location and current weather…</div>
      )}

      {result && <WeatherCard data={result} />}
    </div>
  );
}
