"use client";
import { v4 as uuidv4 } from "uuid";
import { BeatLoader } from "react-spinners";
import style from "./weatherStudy.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import zoomPlugin from "chartjs-plugin-zoom";
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
  Legend,
  zoomPlugin
);
export default function Weather() {
  const [date_first, setDate_first] = useState("");
  const [date_last, setDate_last] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "기온",
        // data: ,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "풍속",
        // data: ,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  });

  useEffect(() => {
    fetchWeather();
  }, []);
  const fetchWeather = async () => {
    const response = await axios.get(
      `/api/weatherAPI?date-first=${date_first}&date-last=${date_last}&region=${selectedRegion}`
    );
    const data = parseWeather(response.data);
  };
  const parseWeather = (data) => {
    const line = data.split("\n").map((item) => item.trim());
    const headerIndex = line.findIndex((line) => line.includes("YYMMDDHHMI"));
    console.log("headerIndex", headerIndex);
    const header = line[headerIndex].replace("#", "").trim().split(/\s+/);
    console.log("header", header);
    const datalines = line.slice();
    const labels = header.map((item) => item.YYMMDDHHMI);
    setChartData({
      labels,
      datasets: [
        {
          label: "기온",
          // data: ,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "풍속",
          // data: ,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    });
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  };

  return (
    <div className="weather_container">
      <div className="weather_top_box">
        <p className="weather_title">지상 관측자료 조회</p>
        <div className="weather_search_box">
          <select className="weather_search_select"></select>
          <input
            type="text"
            placeholder="YYYYMMDDHHMI"
            className="weather_search_input"
          />
          ~
          <input
            type="text"
            placeholder="YYYYMMDDHHMI"
            className="weather_search_input"
          />
          <button className="weather_search_btn">검색</button>
        </div>
      </div>
      <div className="weather_chart">
        <Line options={options} data={chartData} />
      </div>
      <div className="weather_page_wrap">
        <button className="weather_page_btn">
          <SlArrowLeft />
        </button>
        <span className="weather_page_text"></span>
        <button className="weather_page_btn">
          <SlArrowRight />
        </button>
      </div>
      <div className="weather_table_wrap">
        <table className="weather_table">
          <thead>
            <tr>
              <th>상대습도 (%)</th>
              <th>지면온도 (C)</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}
