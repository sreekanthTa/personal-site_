'use client';   

import styles from "./page.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";


 
type Props = {
  folders_to_files_map?:Record<string, { name?: string; path: string }[]>
}

export default function NavClient({folders_to_files_map={}}: Props){

    const router  = useRouter()


    const [visible, setVisible] = React.useState<boolean>(true)


    const handleScroll = () =>{
    
    if(window?.scrollY > 1){
        setVisible(false)
    }else{
        setVisible(true)
    }
    }


    useEffect(()=>{
   
        window.addEventListener('scroll', handleScroll)

        return ()=> window.removeEventListener('scroll', handleScroll)
    },[])


    return   <nav  className={`${styles.container} ${visible ? styles?.visible : styles?.no_visible}`}>
      {Object.entries(folders_to_files_map || [])?.map(([folder,files])=>{
         return  <div key={folder} className={styles.container_item}>
          {

             !files?.[0]?.name ? 


             <div className={styles.container_item_title} onClick={()=>router.push(files?.[0]?.path)}>{folder}</div>


             :
             <>
             <div className={styles.container_item_title}>{folder}</div>
            <div className={styles.container_item_links}>
            {files?.map((file: {name?:string, path:string}) => {
              return <Link key={file?.name} href={file?.path}>{file?.name}</Link>
            })
            }
          </div>

             </>

          }
          
            
          
        </div>
      })}
    </nav>
}