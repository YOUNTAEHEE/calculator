'use client';

import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Nav() {
  const [choice_nav, setChoice_nav] = useState("standard");
  const router = useRouter();

  const handleNavClick =(type) =>{
    setChoice_nav(type);
    if(type === "standard"){
      router.push("/standard");
    }else if(type === "programmer"){
      router.push("/programmer");
    }
  }

  return (
     <div className="c_nav">
      <div className={`c_nav_title ${choice_nav === "standard" ? "on" : ""}`} onClick={()=>handleNavClick("standard")}>표준 계산기</div>
      <div className={`c_nav_title ${choice_nav === "programmer" ? "on" :""}`} onClick={()=>handleNavClick("programmer")} >프로그래머</div>
    </div>
  );
}
