"use client";
import styles from "./topNav.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function TopNav() {
  const router = useRouter();
  const [choice_top_nav, setChoice_top_nav] = useState("calculator");
  const handleTopNavClick = (type) => {
    setChoice_top_nav(type);
    if (type === "calculator") {
      router.push("/calculator/standard");
    } else if (type === "weather") {
      router.push("/weather");
    }
  };
  return (
    <div className="top_nav_wrap">
      <div
        className={`top_nav_title ${
          choice_top_nav === "calculator" ? "on" : ""
        }`}
        onClick={() => handleTopNavClick("calculator")}
      >
        계산기
      </div>
      <span>|</span>
      <div
        className={`top_nav_title ${choice_top_nav === "weather" ? "on" : ""}`}
        onClick={() => handleTopNavClick("weather")}
      >
        기상청
      </div>
    </div>
  );
}
