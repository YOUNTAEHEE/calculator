"use client";

import Image from "next/image";
// import styles from "./versionOne.scss";
import styles from "./programmer.scss";
import { useState, useEffect, useCallback } from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { connectDB } from "../../lib/connectDB";
import { FaTrashAlt } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { resolveObjectURL } from "buffer";
import { useSearchParams } from "next/navigation";
import { CSVLink, CSVDownload } from "react-csv";
import {
  addProgrammer,
  getProgrammer,
  deleteProgrammer,
  getProgrammerByDate,
} from "../../lib/actions";
export default function Programmer() {
  const [monitor_number, setMonitor_number] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState(false);
  const [history_list, setHistory_list] = useState([]);
  const [parenthesis, setParenthesis] = useState(false);
  const [check_list, setCheck_list] = useState([]);
  const [result_HEX, setResult_HEX] = useState("");
  const [result_OCT, setResult_OCT] = useState("");
  const [result_BIN, setResult_BIN] = useState("");
  const [result_DEC, setResult_DEC] = useState("");
  const [show_mobile_btn, setShow_mobile_btn] = useState(false);
  const [selectDate, setSelectDate] = useState(() => {
    return (
      sessionStorage.getItem("selectedDate") ||
      new Date().toISOString().split("T")[0]
    );
  });

  const CSVHeader = [
    { label: "날짜", key: "monitor_date" },
    { label: "계산식", key: "monitor_number" },
    { label: "답", key: "monitor_result" },
  ];

  const CSVdata = history_list.map((item) => ({
    monitor_number: item.monitor_number,
    monitor_result: item.monitor_result,
    monitor_date: item.monitor_date,
  }));

  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const handleMonitorNumber = (e) => {
    setResult("");
    const value = e.target.textContent;
    const lastChar = monitor_number[monitor_number.length - 1];
    const match = monitor_number.match(/(\d+\.?\d*)$/);
    const shiftLeftMatch = monitor_number.match(/(\d+)\s*<<$/);
    const shiftRightMatch = monitor_number.match(/(\d+)\s*>>$/);

    if (/[)]/.test(lastChar) && /\d+/.test(value)) {
      return;
    }
    // if (/[%]/.test(lastChar) && /\d+/.test(value)) {
    //   return;
    // }
    if (/[(]/.test(lastChar) && /[+\-×÷%]/.test(value)) {
      return;
    }
    if (
      (monitor_number.match(/^(0+)$/) && /\d+/.test(value)) ||
      (monitor_number.match(/[+\-×÷](0+)(?!\.)/) && /\d+/.test(value))
    ) {
      return;
    }

    // if (monitor_number.match(/(0+)$/) && /[+\-×÷]/.test(value)) {
    //   return;
    // }

    if (/[%]/.test(lastChar) && /[%]/.test(value)) {
      return;
    }
    if (/[+\-×÷]/.test(lastChar) && value === "1/x") {
      return;
    }
    if (monitor_number === "" && /[+×÷%]/.test(value)) {
      return;
    }
    if ((value === "<<" || value === ">>") && !match) {
      return; // 숫자가 없으면 시프트 연산자 입력 불가
    }

    if (
      (shiftLeftMatch && /\d+/.test(value)) ||
      (shiftRightMatch && /\d+/.test(value))
    ) {
      if (!monitor_number || monitor_number.trim() === "") {
        return;
      }

      const match = shiftLeftMatch || shiftRightMatch;
      const operator = shiftLeftMatch ? "<<" : ">>";
      const number = parseFloat(match[1]);

      let formulaWithoutShift = monitor_number.slice(0, -match[0].length);
      let newFormula = `${formulaWithoutShift}${number} ${operator} ${value}`;

      setMonitor_number(newFormula);
      return;
    }

    if (/[+\-×÷]/.test(lastChar) && /[+\-×÷]/.test(value)) {
      return;
    } else {
      // if (value === "1/x") {
      //   if (!monitor_number || monitor_number.trim() === "") {
      //     return;
      //   }
      //   let number = parseFloat(match[1]);
      //   let changeValue = `1 / ${number}`;
      //   setMonitor_number(
      //     monitor_number.slice(0, -match[0].length) + changeValue
      //   );
      //   return;
      // }
      // if (value === "x²") {
      //   if (!monitor_number || monitor_number.trim() === "") {
      //     return;
      //   }
      //   let number = parseFloat(match[1]);
      //   let changeValue = `(${number} * ${number})`;
      //   setMonitor_number(
      //     monitor_number.slice(0, -match[0].length) + changeValue
      //   );
      //   return;
      // }
      // if (value === "²√x") {
      //   if (!monitor_number || monitor_number.trim() === "") {
      //     return;
      //   }
      //   let number = parseFloat(match[1]);
      //   let changeValue = Math.sqrt(number);
      //   setMonitor_number(
      //     monitor_number.slice(0, -match[0].length) + changeValue
      //   );
      //   return;
      // }

      let min, max;

      switch (mode) {
        case "word":
          min = -32768;
          max = 32767;
          break;
        case "dword":
          min = -2147483648;
          max = 2147483647;
          break;
        case "qword":
          min = -9223372036854775808n;
          max = 9223372036854775807n;
          break;
        default:
          return;
      }

      if (/\d/.test(value)) {
        const newValue = monitor_number + value;
        const numericParts = newValue.split(/[+\-×÷]/);
        const lastNumber = numericParts[numericParts.length - 1];
        if (lastNumber) {
          const num =
            mode === "qword" ? BigInt(lastNumber) : Number(lastNumber);
          if (num < min || num > max) {
            return;
          }
        }
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
    setResult_HEX(""); //16진수
    setResult_OCT(""); //8진수
    setResult_BIN(""); //2진수
    setResult_DEC(""); //10진수
  };

  const handleMonitorResult = async (e) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const todayKOR = new Date()
        .toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/\./g, "-")
        .replace(/\.$/, "")
        .replace(/- (오전|오후)/, " $1");
      if (monitor_number.match(/([÷])(0+\.?0*)$/)) {
        setResult(`0으로 나눌 수 없습니다.`);
        return;
      }

      if (!/(?:[+\-×÷%]|>>|<<)/.test(monitor_number)) {
        return;
      }

      if (!monitor_number || /(?:[+\-×÷%]|>>|<<)$/.test(monitor_number)) {
        return;
      }

      let formula = monitor_number;

      // 16진수 문자(A-F)를 포함한 숫자를 처리
      // formula = formula.replace(/([0-9A-F]+)/g, (match) => {
      //   return String(parseInt(match, 16)); // 16진수를 10진수로 변환
      // });

      formula = formula.replace(/(\d+)\s*÷\s*(\d+)/g, (match, num1, num2) => {
        return String(parseInt(parseInt(num1) / parseInt(num2)));
      });

      // 시프트 연산 처리 추가
      formula = formula.replace(/(\d+)\s*<<\s*(\d+)/g, (match, num, shift) => {
        return String(parseInt(num) << parseInt(shift));
      });

      formula = formula.replace(/(\d+)\s*>>\s*(\d+)/g, (match, num, shift) => {
        return String(parseInt(num) >> parseInt(shift));
      });

      formula = formula
        .replace(/÷/g, "/")
        .replace(/×/g, "*")
        .replace(/−/g, "-");

      // formula = formula.replace(
      //   /(\d+\.?\d*)\s*([×*÷/])\s*(\d+\.?\d*)\s*%/g,
      //   (match, number1, operator, number2) => {
      //     const op = operator === "×" || operator === "*" ? "*" : "/";
      //     return `(${number1} ${op} ${number2 / 100})`;
      //   }
      // );

      // formula = formula.replace(
      //   /(\d+\.?\d*)\s*([+\-])\s*(\d+\.?\d*)\s*%/g,
      //   (match, number1, operator, number2) => {
      //     return `(${number1} ${operator} (${number1} * ${number2 / 100}))`;
      //   }
      // );

      const result = new Function("return " + formula)();
      let integerResult = Math.floor(result);
      // 2진수 변환 시 4비트 단위로 0을 채우는 함수
      const padBinary = (num, bits = 4) => {
        const binary = Math.abs(num).toString(2);
        // 4비트 단위로 맞추기 위한 앞쪽 0 패딩
        const padding = binary.length % bits;
        const paddedBinary =
          padding > 0 ? "0".repeat(bits - padding) + binary : binary;

        // 4비트씩 그룹화하고 공백으로 구분
        return paddedBinary.match(/.{1,4}/g).join(" ");
      };
      const newId = uuidv4();
      switch (mode) {
        case "word": {
          // 16비트 범위로 제한 (-32768 ~ 32767)
          const mod = 65536; // 2^16
          integerResult = ((integerResult % mod) + mod) % mod;
          if (integerResult >= 32768) {
            integerResult -= 65536;
          }
          const absResult = Math.abs(integerResult);
          setResult_HEX("0x" + absResult.toString(16).toUpperCase()); //16진수
          setResult_OCT("0o" + absResult.toString(8)); //8진수
          setResult_BIN("0b" + padBinary(absResult)); //2진수
          setResult_DEC(integerResult.toString()); //10진수

          setResult(integerResult.toString());
          const format_result = integerResult.toString();
          const formData = new FormData();
          formData.append("id", newId);
          formData.append("monitor_number", monitor_number);
          formData.append("monitor_result", format_result);
          formData.append("monitor_date", todayKOR);
          await addProgrammer(formData);
          if (selectDate === today) {
            setHistory_list((prev) => {
              const updatedHistory = [
                {
                  id: newId,
                  monitor_number: monitor_number,
                  monitor_result: format_result,
                  monitor_date: todayKOR,
                },
                ...prev,
              ];

              return updatedHistory;
            });
          }

          break;
        }
        case "dword": {
          // 32비트 범위로 제한 (-2147483648 ~ 2147483647)
          const mod = 4294967296; // 2^32
          integerResult = ((integerResult % mod) + mod) % mod;
          if (integerResult >= 2147483648) {
            integerResult -= 4294967296;
          }
          const absResult = Math.abs(integerResult);
          setResult_HEX("0x" + absResult.toString(16).toUpperCase()); //16진수
          setResult_OCT("0o" + absResult.toString(8)); //8진수
          setResult_BIN("0b" + padBinary(absResult)); //2진수
          setResult_DEC(integerResult.toString()); //10진수

          setResult(integerResult.toString());
          const format_result = integerResult.toString();
          const formData = new FormData();
          formData.append("id", newId);
          formData.append("monitor_number", monitor_number);
          formData.append("monitor_result", format_result);
          formData.append("monitor_date", todayKOR);
          await addProgrammer(formData);
          if (selectDate === today) {
            setHistory_list((prev) => {
              const updatedHistory = [
                {
                  id: newId,
                  monitor_number: monitor_number,
                  monitor_result: format_result,
                  monitor_date: todayKOR,
                },
                ...prev,
              ];

              return updatedHistory;
            });
          }

          break;
        }
        case "qword": {
          try {
            // 문자열로 된 수식을 BigInt로 계산하기 위한 처리
            const cleanFormula = formula.replace(/×/g, "*").replace(/÷/g, "/");

            // 수식의 각 숫자를 BigInt로 변환하여 계산
            const result = eval(
              cleanFormula
                .split(/([+\-*\/])/)
                .map((part) => {
                  if (/^\d+$/.test(part)) {
                    return `BigInt("${part}")`;
                  }
                  return part;
                })
                .join("")
            );

            // 64비트 범위로 제한 (-2^63 ~ 2^63-1)
            const mod = BigInt("18446744073709551616"); // 2^64
            let integerResult = ((result % mod) + mod) % mod;

            if (integerResult >= BigInt("9223372036854775808")) {
              integerResult -= mod;
            }

            setResult(integerResult.toString());
            setResult_HEX("0x" + integerResult.toString(16).toUpperCase());
            setResult_OCT("0o" + integerResult.toString(8));
            setResult_BIN("0b" + integerResult.toString(2));
            setResult_DEC(integerResult.toString());
            const format_result = integerResult.toString();
            const formData = new FormData();
            formData.append("id", newId);
            formData.append("monitor_number", monitor_number);
            formData.append("monitor_result", format_result);
            formData.append("monitor_date", todayKOR);
            await addProgrammer(formData);
            if (selectDate === today) {
              setHistory_list((prev) => {
                const updatedHistory = [
                  {
                    id: newId,
                    monitor_number: monitor_number,
                    monitor_result: format_result,
                    monitor_date: todayKOR,
                  },
                  ...prev,
                ];

                return updatedHistory;
              });
            }
          } catch (error) {
            console.error("QWORD calculation error:", error);
            setResult("Error: Number too large");
          }
          break;
        }
      }

      // const absReslut = Math.abs(integerResult);
      // setResult_HEX(absReslut.toString(16).toUpperCase()); //16진수
      // setResult_OCT(absReslut.toString(8)); //8진수
      // setResult_BIN(absReslut.toString(2)); //2진수
      // setResult_DEC(integerResult.toString()); //10진수

      // const format_result = Number.isInteger(result)
      //   ? result.toString()
      //   : parseFloat(result.toFixed(5)).toString();

      // setResult(integerResult.toString());

      // const format_result = integerResult.toString();

      // const formData = new FormData();
      // formData.append("id", newId);
      // formData.append("monitor_number", monitor_number);
      // formData.append("monitor_result", format_result);

      // await addProgrammer(formData);

      // setHistory_list((prev) => {
      //   const updatedHistory = [
      //     {
      //       id: newId,
      //       monitor_number: monitor_number,
      //       monitor_result: format_result,
      //     },
      //     ...prev,
      //   ];

      //   return updatedHistory;
      // });

      setMonitor_number("");
    } catch (error) {
      console.log(error);
    }
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

  const handleAllCheck = (checked) => {
    if (checked) {
      const idArray = [];
      history_list.forEach((el) => idArray.push(el.id));
      setCheck_list(idArray);
    } else if (!checked) {
      setCheck_list([]);
    }
  };
  const handleSingleCheck = (checked, id) => {
    if (checked) {
      setCheck_list((prev) => [...prev, id]);
    } else if (!checked) {
      setCheck_list(check_list.filter((el) => el !== id));
    }
  };

  const handleCheckDel = async () => {
    try {
      const formData = new FormData();

      check_list.forEach((el) => {
        formData.append("id", el);
      });

      const currenrData = await getProgrammer();
      const existData = currenrData.map((el) => el.id);
      const nonExistData = check_list.filter((el) => !existData.includes(el));
      if (nonExistData.length > 0) {
        alert("이미 삭제된 내용입니다.");

        setHistory_list((prev) =>
          prev.filter((el) => !nonExistData.includes(el.id))
        );
        setCheck_list((prev) =>
          prev.filter((id) => !nonExistData.includes(id))
        );
      }

      await deleteProgrammer(formData);
      setHistory_list(history_list.filter((el) => !check_list.includes(el.id)));
      setCheck_list([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectDate(date);
    sessionStorage.setItem("selectedDate", date);

    try {
      const dateData = await getProgrammerByDate(date);
      setHistory_list(dateData);
    } catch (error) {
      console.log("날짜 조회 실패", error);
    }
  };

  useEffect(() => {
    const element = document.querySelector(".monitor_text");
    if (element) {
      element.scrollLeft = element.scrollWidth;
    }
  }, [monitor_number]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 500) {
        setShow_mobile_btn(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const loadHistory = useCallback(async () => {
    try {
      const viewHistory = await getProgrammerByDate(selectDate);
      setHistory_list(viewHistory || []);
    } catch (error) {
      console.error("데이터 로딩 실패", error);
    }
  }, [selectDate]);

  useEffect(() => {
    loadHistory();
    // 5초마다 데이터 새로고침
    const intervalId = setInterval(loadHistory, 5000);
    return () => clearInterval(intervalId);
  }, [loadHistory]);

  return (
    <div className="programmer_calculator">
      <div className={`main_content ${history ? "on" : ""}`}>
        <div className="main_box">
          <div className="r_monitor">
            <div className="monitor_top_box">
              <p className="monitor_text monitor_top_text">{monitor_number}</p>
              <p className="monitor_result">{result}</p>
            </div>
            <div className="monitor_bottom_box">
              <div className="monitor_bottom_box_1 ">
                <p className=" m_s_text_top">HEX</p>
                <p className=" m_s_text_top">DEC</p>
                <p className=" m_s_text_top">OCT</p>
                <p className=" m_s_text_top">BIN</p>
              </div>
              <div className="monitor_bottom_box_2 ">
                <p className=" m_s_text_result">{result_HEX}</p>
                <p className="m_s_text_result">{result_DEC}</p>
                <p className="m_s_text_result">{result_OCT}</p>
                <p className=" m_s_text_result">{result_BIN}</p>
              </div>
            </div>
          </div>
          <div className="button_big_box">
            <div className="button_box_center" onClick={handleHistory}>
              기록
            </div>
            <div
              className="button_box_mobile_show_btn "
              onClick={() => setShow_mobile_btn(!show_mobile_btn)}
            >
              계산기 기능 키 {show_mobile_btn ? "숨기기" : "펼치기"}
            </div>

            <div className="button_box_wrap">
              <div
                className={`mobile_hidden ${
                  show_mobile_btn === true ? "on" : ""
                }`}
              >
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
                    {"<<"}
                  </div>
                  <div
                    className="num_button s_button "
                    onClick={handleMonitorNumber}
                  >
                    {">>"}
                  </div>
                  <div
                    className="num_button s_button s_b_f"
                    onClick={handleParenthesis}
                  >
                    ()
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
                    className="num_button s_button"
                    onClick={handleMonitorResult}
                  >
                    =
                  </div>
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
                  className="num_button zero_btn"
                  onClick={handleMonitorNumber}
                >
                  0
                </div>
                {/* <div className=" none_btn"> </div>
                <div className=" none_btn"> </div> */}
              </div>
              {/* <div className="button_box">
                <div
                  className="num_button s_button "
                  onClick={handleMonitorNumber}
                >
                  A
                </div>
                <div
                  className="num_button s_button "
                  onClick={handleMonitorNumber}
                >
                  B
                </div>

                <div
                  className="num_button s_button "
                  onClick={handleMonitorNumber}
                >
                  C
                </div>
              </div>
              <div className="button_box">
                <div
                  className="num_button s_button "
                  onClick={handleMonitorNumber}
                >
                  D
                </div>
                <div
                  className="num_button s_button "
                  onClick={handleMonitorNumber}
                >
                  E
                </div>
                <div
                  className="num_button s_button "
                  onClick={handleMonitorNumber}
                >
                  F
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className={`history_wrap ${history ? "on" : ""}`}>
          <div className="history_top">
            <CSVLink
              data={CSVdata}
              headers={CSVHeader}
              filename={`계산 기록 CSV`}
              className="history_top_csv"
            >
              CSV 저장
            </CSVLink>
            <input
              type="date"
              id="start-date"
              min=""
              value={selectDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
              className="history_date"
            ></input>
          </div>
          <div className="history_m_wrap">
            <div className="history_small_wrap">
              {history_list.length > 0 ? (
                history_list.map((item, index) => (
                  <div className="history_one" key={item.id}>
                    <input
                      className="history_one_check"
                      type="checkbox"
                      onChange={(e) => {
                        handleSingleCheck(e.target.checked, item.id);
                      }}
                      checked={check_list.includes(item.id)}
                    />
                    <div className="history_one_in_box2">
                      <p className="history_formula">{item.monitor_number}</p>
                      <p className="history_result">{item.monitor_result}</p>
                      <p className="history_monitor_date">
                        {item.monitor_date}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="history_none">
                  <p>해당 날짜의 기록이 없습니다.</p>
                </div>
              )}
            </div>
            <div className="history_bottom">
              <div className="all_check">
                <input
                  className="history_all_check"
                  type="checkbox"
                  id="history_all_check"
                  onChange={(e) => handleAllCheck(e.target.checked)}
                  checked={
                    check_list.length === history_list.length &&
                    history_list.length > 0
                  }
                />
                <label
                  className="history_all_check_text"
                  htmlFor="history_all_check"
                >
                  전체 선택
                </label>
              </div>
              <div className="delete_btn" onClick={handleCheckDel}>
                <FaTrashAlt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
