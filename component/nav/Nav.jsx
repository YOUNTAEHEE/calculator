"use client";
import styles from "./nav.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const [choice_nav, setChoice_nav] = useState("standard");
  const [choice_programmer, setChoice_programmer] = useState("word");
  const router = useRouter();

  const handleNavClick = (type) => {
    setChoice_nav(type);
    console.log("Updated choice_nav:", type);
    if (type === "standard") {
      setChoice_programmer("");
      router.push("/standard");
    } else if (type === "programmer") {
      setChoice_programmer("word");
      router.push("/programmer?mode=word");
    }
  };

  const handleProgrammerNavClick = (type) => {
    setChoice_programmer(type);
    if (type === "word") {
      router.push(`/programmer?mode=${type}`);
    } else if (type === "dword") {
      router.push(`/programmer?mode=${type}`);
    } else if (type === "qword") {
      router.push(`/programmer?mode=${type}`);
    }
  };

  return (
    <div className="c_nav_box">
      <div className="c_nav">
        <div
          className={`c_nav_title  ${choice_nav === "standard" ? "on" : ""}`}
          onClick={() => handleNavClick("standard")}
        >
          표준 계산기
        </div>
        <div
          className={`c_nav_title ${choice_nav === "programmer" ? "on" : ""}`}
          onClick={() => handleNavClick("programmer")}
        >
          프로그래머
        </div>
      </div>
      <div className="programmer_nav">
        <div
          className={`programmer_nav_title ${
            choice_nav === "programmer" && choice_programmer === "word"
              ? "on"
              : ""
          }`}
          onClick={() => handleProgrammerNavClick("word")}
        >
          WORD
        </div>
        <div
          className={`programmer_nav_title ${
            choice_nav === "programmer" && choice_programmer === "dword"
              ? "on"
              : ""
          }`}
          onClick={() => handleProgrammerNavClick("dword")}
        >
          DWORD
        </div>
        <div
          className={`programmer_nav_title ${
            choice_nav === "programmer" && choice_programmer === "qword"
              ? "on"
              : ""
          }`}
          onClick={() => handleProgrammerNavClick("qword")}
        >
          QWORD
        </div>
      </div>
    </div>
  );
}
