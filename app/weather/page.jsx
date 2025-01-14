"use client";
import { BeatLoader } from "react-spinners";
import "./weather.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
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
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("0"); // 기본 지역 코드 설정
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const itemsPerPage = 15; // 한 페이지에 표시할 데이터 수
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
  const [date_first, setDate_first] = useState(getToday() + "0000");
  const [date_last, setDate_last] = useState(getToday() + "2359");
  const fetchWeather = async (
    selectedDate_first,
    selectedDate_last,
    regionCode
  ) => {
    try {
      const response = await axios.get(
        `/api/weatherAPI?date-first=${selectedDate_first}&date-last=${selectedDate_last}&region=${regionCode}`
      );
      console.log("API 응답 데이터:", response.data);

      const parsedData = parseWeatherData(response.data);
      console.log("파싱된 데이터:", parsedData);
      setFilteredData(parsedData); // 전체 데이터를 저장
      setCurrentPage(0);
      updateChartData(parsedData.slice(0, itemsPerPage)); // 처음 15개만 표시
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
  const updateChartData = (data) => {
    const labels = data.map((entry) => entry.YYMMDDHHMI);
    const temperatureData = data.map((entry) => parseFloat(entry.TA));
    const windSpeedData = data.map((entry) => parseFloat(entry.WS));

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
  };
  const totalPages = Math.ceil(filteredData.length / itemsPerPage); // 총 페이지 수 계산
  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (startIndex < filteredData.length) {
      setCurrentPage(nextPage);
      updateChartData(filteredData.slice(startIndex, endIndex));
    }
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 0) {
      const startIndex = prevPage * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      setCurrentPage(prevPage);
      updateChartData(filteredData.slice(startIndex, endIndex));
    }
  };
  const handleSearch = () => {
    setIsSearchTriggered(true); // 검색 버튼 클릭 시 상태 업데이트
  };
  useEffect(() => {
    if (isSearchTriggered) {
      fetchWeather(date_first, date_last, selectedRegion);
      setIsSearchTriggered(false); // 검색 후 상태 초기화
    }
  }, [isSearchTriggered]);
  useEffect(() => {
    // 페이지 로드 시 초기 데이터 가져오기
    fetchWeather(date_first, date_last, selectedRegion);
  }, []); // 빈 의존성 배열로 초기 한 번 실행

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
            className="weather_search_select"
          >
            {regions.map((region) => (
              <option key={region.code} value={region.code}>
                {region.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={date_first}
            onChange={(e) => setDate_first(e.target.value)}
            placeholder="YYYYMMDDHHMI"
            className="weather_search_input"
          />
          ~
          <input
            type="text"
            value={date_last}
            onChange={(e) => setDate_last(e.target.value)}
            placeholder="YYYYMMDDHHMI"
            className="weather_search_input"
          />
          <button onClick={handleSearch} className="weather_search_btn">
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
      <div className="weather_page_wrap">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="weather_page_btn"
        >
          <SlArrowLeft />
        </button>
        <span className="weather_page_text">
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= filteredData.length}
          className="weather_page_btn"
        >
          <SlArrowRight />
        </button>
      </div>
    </div>
  );
}
