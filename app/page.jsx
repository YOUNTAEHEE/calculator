'use client';
import Standard from "./standard/page";
import Programmer from "./programmer/page";
import { useRouter } from 'next/navigation';
import { useState } from "react";
// import VersionTwo from "../component/versionTwo/VersionTwo";
import styles from "./home.scss";

export default function Home() {
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
    <div >
     <Standard />
    </div>
  );
}
