"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get("/api/weatherAPI"); // axios로 API 호출
        setWeather(response.data); // 응답 데이터 설정
      } catch (error) {
        console.error("Error fetching weather data:", error.message); // 에러 로그 출력
        setError(error.message);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div>
      <h1>Weather Data</h1>
      {error && <p>Error: {error}</p>}
      {weather ? (
        <pre>{JSON.stringify(weather, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
