"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js를 초기화합니다.
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);
export default function Weather() {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get("/api/weatherAPI");
        console.log("API 응답 데이터:", response.data);

        const parsedData = parseWeatherData(response.data);
        console.log("파싱된 데이터:", parsedData);

        // 필터링된 데이터 생성
        const filteredData = parsedData.filter(
          (data) => !isNaN(parseFloat(data.TA)) && !isNaN(parseFloat(data.WS)) // 유효한 값만
        );

        // 필터링된 데이터로 차트 값 생성
        const labels = filteredData.map((data) => data.YYMMDDHHMI);
        const temperatureData = filteredData.map((data) => parseFloat(data.TA));
        const windSpeedData = filteredData.map((data) => parseFloat(data.WS));
        setChartData({
          labels,
          datasets: [
            {
              label: "Temperature (°C)",
              data: temperatureData,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
            },
            {
              label: "Wind Speed (m/s)",
              data: windSpeedData,
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching weather data:", error.message);
        setError(error.message);
      }
    };

    fetchWeather();
  }, []);

  const parseWeatherData = (rawData) => {
    console.log("Raw data received:", rawData);

    const lines = rawData.split("\n").map((line) => line.trim());
    console.log("Split lines:", lines);

    const headerIndex = lines.findIndex((line) => line.includes("YYMMDDHH"));
    if (headerIndex === -1) {
      console.error("Header not found in raw data.");
      return [];
    }

    const headers = lines[headerIndex].replace("#", "").trim().split(/\s+/);
    console.log("Parsed headers:", headers);

    const dataLines = lines
      .slice(headerIndex + 1)
      .filter((line) => line && !line.startsWith("#"));
    console.log("Filtered data lines:", dataLines);

    return dataLines
      .map((line) => {
        const values = line.split(/\s+/);
        if (values.length < headers.length) {
          console.warn("Mismatched data line, skipping:", line);
          return null;
        }

        const entry = {};
        headers.forEach((header, index) => {
          entry[header] = values[index];
        });
        return entry;
      })
      .filter(Boolean);
  };
  // 차트 데이터 확인용
  useEffect(() => {
    console.log("차트 데이터:", chartData);
  }, [chartData]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!chartData) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>Weather Data Visualization</h1>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Temperature and Wind Speed Over Time",
            },
          },
        }}
      />
    </div>
  );
}
