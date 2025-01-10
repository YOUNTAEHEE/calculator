"use client";

import { useEffect, useState } from "react";

export default function Weather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weatherAPI");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div>
      <h1>Weather Data</h1>
      {weather ? (
        <pre>{JSON.stringify(weather, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
