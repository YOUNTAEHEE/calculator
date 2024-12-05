"use client";

import Image from "next/image";
import styles from "./main.scss";
import { useState, useEffect } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
export default function Home() {
  const [monitor_number, setMonitor_number] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState(false);
  const [parenthesis, setParenthesis] = useState(false);

  const handleMonitorNumber = (e) => {
    const value = e.target.textContent;
    const lastChar = monitor_number[monitor_number.length - 1];
    if (/[+\-×÷]/.test(lastChar) && /[+\-×÷]/.test(value)) {
      return;
    } else {
      setMonitor_number((prev) => prev + value);
    }
  };

  const handleMonitorOneDel = (e) => {
    setMonitor_number(monitor_number.slice(0, -1));
  };

  const handleAllDel = (e) => {
    setMonitor_number("");
  };

  const handleMonitorResult = (e) => {
    let formula = monitor_number
      .replace(/÷/g, "/")
      .replace(/×/g, "*")
      .replace(/−/g, "-")
      .replace(/\+/g, "+")
      .replace(/%/g, "%");
    const result = new Function("return " + formula)();

    const format_result = Number.isInteger(result)
      ? result.toString()
      : result.toFixed(4);

    setResult(format_result);
  };

  const handleParenthesis = (e) => {
    if (!parenthesis) {
      setMonitor_number((prev) => prev + "(");
      setParenthesis(!parenthesis);
    } else {
      setMonitor_number((prev) => prev + ")");
      setParenthesis(!parenthesis);
    }
  };

  const handleHistory = () => {
    setHistory(!history);
  };

  useEffect(() => {
    const element = document.querySelector(".monitor_text");
    if (element) {
      element.scrollLeft = element.scrollWidth;
    }
  }, [monitor_number]);
  return (
    <div className="main_container">
      <div className={`main_content ${history ? "on" : ""}`}>
        <div className="main_box">
          <div className="r_monitor">
            <p className="monitor_text">{monitor_number}</p>
            <p className="monitor_result">{result}</p>
          </div>
          <div className="button_big_box">
            <div className="button_box_center" onClick={handleHistory}>
              기록
            </div>
            <div className="button_box_wrap">
              <div className="button_box">
                {/* <div className="num_button s_button s_b_f_2">CE</div> */}
                <div
                  className="num_button s_button s_b_f_2 all_del_button"
                  onClick={handleAllDel}
                >
                  AC
                </div>
                <div
                  className="num_button s_button s_b_f_2 one_del_button"
                  onClick={handleMonitorOneDel}
                >
                  <FaDeleteLeft />
                </div>
              </div>
              <div className="button_box">
                <div
                  className="num_button s_button s_b_big"
                  onClick={handleMonitorNumber}
                >
                  ÷
                </div>
                <div
                  className="num_button s_button s_b_big"
                  onClick={handleMonitorNumber}
                >
                  ×
                </div>
                <div
                  className="num_button s_button s_b_big"
                  onClick={handleMonitorNumber}
                >
                  -
                </div>
              </div>
              <div className="button_box">
                <div
                  className="num_button s_button s_b_f"
                  onClick={handleMonitorNumber}
                >
                  %
                </div>
                <div
                  className="num_button s_button s_b_big"
                  onClick={handleMonitorNumber}
                >
                  +
                </div>
                <div
                  className="num_button s_button s_b_f"
                  onClick={handleMonitorResult}
                >
                  =
                </div>
              </div>
              <div className="button_box">
                <div className="num_button" onClick={handleMonitorNumber}>
                  7
                </div>
                <div className="num_button" onClick={handleMonitorNumber}>
                  8
                </div>
                <div className="num_button" onClick={handleMonitorNumber}>
                  9
                </div>
              </div>
              <div className="button_box">
                <div className="num_button" onClick={handleMonitorNumber}>
                  4
                </div>
                <div className="num_button" onClick={handleMonitorNumber}>
                  5
                </div>
                <div className="num_button" onClick={handleMonitorNumber}>
                  6
                </div>
              </div>
              <div className="button_box">
                <div className="num_button" onClick={handleMonitorNumber}>
                  1
                </div>
                <div className="num_button" onClick={handleMonitorNumber}>
                  2
                </div>
                <div className="num_button" onClick={handleMonitorNumber}>
                  3
                </div>
              </div>
              <div className="button_box">
                <div
                  className="num_button s_button s_b_f"
                  onClick={handleParenthesis}
                >
                  ()
                </div>
                <div className="num_button" onClick={handleMonitorNumber}>
                  0
                </div>
                <div
                  className="num_button s_button s_b_big"
                  onClick={handleMonitorNumber}
                >
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`history_wrap ${history ? "on" : ""}`}>
          <div className="history_one">
            <p className="history_formula">계산식</p>
            <p className="history_result">결과</p>
          </div>
          <div className="history_one">
            <p className="history_formula">계산식</p>
            <p className="history_result">결과</p>
          </div>
        </div>
      </div>
    </div>
  );
}
