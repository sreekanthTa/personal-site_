'use client';   

import styles from "./page.module.css";
import Link from "next/link";
import React, { useEffect } from "react";


type NavData = Record<string, { name: string; path: string }[]>;

export default function NavClient({folders_to_files_map}: {folders_to_files_map:NavData}){

    const [visible, setVisible] = React.useState<boolean>(true)


    const handleScroll = () =>{

    if(window?.scrollY > 200){
        setVisible(false)
    }else{
        setVisible(true)
    }
    }


    useEffect(()=>{
   
        window.addEventListener('scroll', handleScroll)

        return ()=> window.removeEventListener('scroll', handleScroll)
    },[])


    return   <div  className={`${styles.container} ${visible ? styles?.visible : styles?.no_visible}`}>
      {Object.entries(folders_to_files_map)?.map(([folder,files])=>{
         return  <div className={styles.container_item}>
          <div className={styles.container_item_title}>{folder}</div>
          <div className={styles.container_item_links}>
            {files?.map((file: {name:string, path:string}) => {
              return <Link key={file?.name} href={file?.path}>{file?.name}</Link>
            })
            }
          </div>
        </div>
      })}

    </div>
}