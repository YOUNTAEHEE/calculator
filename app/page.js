"use client";

import Image from "next/image";
import styles from "./main.scss";
import { useState, useEffect } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
export default function Home() {
  const [monitor_number, setMonitor_number] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState(false);
  const [history_list, setHistory_list] = useState([]);
  const [parenthesis, setParenthesis] = useState(false);

  const handleMonitorNumber = (e) => {
    setResult("");
    const value = e.target.textContent;
    const lastChar = monitor_number[monitor_number.length - 1];
    const match = monitor_number.match(/(\d+\.?\d*)$/);

    if (/[%]/.test(lastChar) && /[%]/.test(value)) {
      return;
    }
    if (/[+\-×÷]/.test(lastChar) && value === "1/x") {
      return;
    }
    if (monitor_number === "" && /[+\-×÷%]/.test(value)) {
      return;
    }

    if (/[+\-×÷]/.test(lastChar) && /[+\-×÷]/.test(value)) {
      return;
    } else {
      if (value === "1/x") {
        let number = parseFloat(match[1]);
        let changeValue = `1 / ${number}`;
        setMonitor_number(
          monitor_number.slice(0, -match[0].length) + changeValue
        );
        return;
      }
      if (value === "x²") {
        let number = parseFloat(match[1]);
        let changeValue = `(${number} * ${number})`;
        setMonitor_number(
          monitor_number.slice(0, -match[0].length) + changeValue
        );
        return;
      }
      if (value === "²√x") {
        let number = parseFloat(match[1]);
        let changeValue = Math.sqrt(number);
        setMonitor_number(
          monitor_number.slice(0, -match[0].length) + changeValue
        );
        return;
      }
      setMonitor_number((prev) => prev + value);
    }
  };

  const handleMonitorOneDel = (e) => {
    setMonitor_number(monitor_number.slice(0, -1));
  };

  const handleAllDel = (e) => {
    setMonitor_number("");
    setResult("");
  };

  const handleMonitorResult = async (e) => {
    if (!monitor_number || /[+\-×÷]$/.test(monitor_number)) {
      return;
    }

    let formula = monitor_number;

    formula = formula.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");

    formula = formula.replace(
      /(\d+\.?\d*)\s*([×*÷/])\s*(\d+\.?\d*)\s*%/g,
      (match, number1, operator, number2) => {
        const op = operator === "×" || operator === "*" ? "*" : "/";
        return `(${number1} ${op} ${number2 / 100})`;
      }
    );

    formula = formula.replace(
      /(\d+\.?\d*)\s*([+\-])\s*(\d+\.?\d*)\s*%/g,
      (match, number1, operator, number2) => {
        return `(${number1} ${operator} (${number1} * ${number2 / 100}))`;
      }
    );

    formula = formula.replace();

    const result = new Function("return " + formula)();

    const format_result = Number.isInteger(result)
      ? result.toString()
      : parseFloat(result.toFixed(5)).toString();

    setResult(format_result);
    setHistory_list((prev) => [
      ...prev,
      { monitor_number: monitor_number, result: format_result },
    ]);
    // 디비추가
    // try {
    //   const response = await fetch("/api/study", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       monitor_number: monitor_number,
    //       result: format_result,
    //     }),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to save calculation");
    //   }
    // } catch (error) {
    //   console.error("Error saving calculation:", error);
    // }

    setMonitor_number("");
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "/":
          handleMonitorNumber({ target: { textContent: "÷" } });
          break;
        case "*":
          handleMonitorNumber({ target: { textContent: "×" } });
          break;
        case "-":
          handleMonitorNumber({ target: { textContent: "-" } });
          break;
        case "+":
          handleMonitorNumber({ target: { textContent: "+" } });
          break;
        case "%":
          handleMonitorNumber({ target: { textContent: "%" } });
          break;
        case "Enter":
          handleMonitorResult();
          break;

        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          handleMonitorNumber({ target: { textContent: e.key } });
          break;
        case ".":
          handleMonitorNumber({ target: { textContent: "." } });
          break;
        case "Backspace":
          handleMonitorOneDel();
          break;
        case "Delete":
          handleAllDel();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
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
              {/* 연산자 추가 */}
              <div className="button_box">
                <div
                  className="num_button s_button "
                  onClick={handleMonitorNumber}
                >
                  1/x
                </div>
                <div
                  className="num_button s_button "
                  onClick={handleMonitorNumber}
                >
                  x²
                </div>
                <div
                  className="num_button s_button "
                  onClick={handleMonitorNumber}
                >
                  ²√x
                </div>
              </div>
              {/* 연산자 추가끝 */}
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
          {history_list.map((item, index) => (
            <div className="history_one" key={index}>
              <p className="history_formula">{item.monitor_number}</p>
              <p className="history_result">{item.result}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
