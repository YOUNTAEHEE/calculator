"use client";
import { BeatLoader } from "react-spinners";
import "./weather.scss";
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
  const [selectedRegion, setSelectedRegion] = useState("0"); // 기본 지역 코드 설정
  const regions = [
    { code: "0", name: "전체" },
    { code: "101", name: "춘천" },
    { code: "100", name: "대관령" },
    { code: "119", name: "수원" },
  ];
  // 오늘 날짜를 기본값으로 설정
  const getToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}${month}${day}`;
  };
  const [date, setDate] = useState(getToday());
  const fetchWeather = async (selectedDate, regionCode) => {
    try {
      const response = await axios.get(
        `/api/weatherAPI?date=${selectedDate}&region=${regionCode}`
      );
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
            label: "기온 (°C)",
            data: temperatureData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
          },
          {
            label: "풍속 (m/s)",
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

  useEffect(() => {
    fetchWeather(date, selectedRegion); // date 값을 전달
  }, [date, selectedRegion]);

  // 차트 데이터 확인용
  useEffect(() => {
    console.log("차트 데이터:", chartData);
  }, [chartData]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!chartData) {
    return (
      <div className="loding_icon">
        <BeatLoader color="#b19ae0" />
      </div>
    );
  }
  return (
    <div className="weather_container">
      <div className="weather_top_box">
        <p className="weather_title">지상 관측자료 조회</p>
        <div className="weather_search_box">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="YYYYMMDDHHMI"
          />
          <button onClick={() => fetchWeather(date, selectedRegion)}>
            검색
          </button>
        </div>
      </div>
      <div className="weather_chart">
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
                text: "기온 및 풍속 시간 변화",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
