"use client";

import Image from "next/image";
import styles from "./main.scss";
import { useState } from "react";

export default function Home() {
  const [monitor_number, setMonitor_number] = useState(0);


  const handleMonitorNumber = (e) =>{
    const number_button_text =  e.target.textContent;
    setMonitor_number(number_button_text)
  } 

  return (
    <div className="main_container">
      <div className="main_content">
      <div className="r_monitor">
        <p className="monitor_text">{monitor_number}</p>
        <p className="monitor_result">0</p>
      </div>
      <div className="button_big_box">
        <div className="button_box_center">기록</div>
        <div className="button_box_wrap">
        <div className="button_box">
          <div className="num_button s_button s_b_f_2">CE</div>
          <div  className="num_button s_button s_b_f_2">C</div>
          <div  className="num_button s_button s_b_f_2">삭제</div>
        </div>
        <div  className="button_box">
          <div  className="num_button s_button s_b_big" onClick={handleMonitorNumber}>÷</div>
          <div  className="num_button s_button s_b_big" onClick={handleMonitorNumber}>×</div>
          <div  className="num_button s_button s_b_big"  onClick={handleMonitorNumber}>−</div>
        </div>
        <div  className="button_box">
          <div  className="num_button s_button s_b_f"  onClick={handleMonitorNumber}>%</div>
          <div  className="num_button s_button s_b_big"  onClick={handleMonitorNumber}>+</div>
          <div  className="num_button s_button s_b_f">=</div>
        </div>
        <div  className="button_box">
          <div className="num_button">7</div>
          <div className="num_button">8</div>
          <div className="num_button">9</div>     
        </div>
        <div  className="button_box">
          <div className="num_button">4</div>
          <div className="num_button">5</div>
          <div className="num_button">6</div>     
        </div>
        <div  className="button_box">
          <div className="num_button">1</div>
          <div className="num_button">2</div>
          <div className="num_button">3</div>     
        </div>
        </div>
        <div className="button_box_center2">
          <div className="num_button">0</div>
        </div>
      </div>
      </div>
    </div>
  );
}
