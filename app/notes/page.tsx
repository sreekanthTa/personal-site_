'use client';
import styles from "./page.module.css";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Page() {

  useEffect(()=>{
    redirect("/notes/docker?level=basic")
  },[])
 

  return (
    <div className={styles.container}>
       Loading...
    </div>
  );
}

