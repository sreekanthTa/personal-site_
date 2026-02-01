'use client'

import { CreateMLCEngine } from "@mlc-ai/web-llm";
import React , {useEffect, useState} from "react";
import styles from "./page.module.css";


export default function WebLLM() {

  const [progress, setProgress] = useState(0);
  const [engine, setEngine] = useState<any>(null);

    const load_model = async () =>{

        
    const initProgressCallback = (initProgress:any) => {
            console.log(initProgress);
                    setProgress(initProgress.progress ?? 0);

            }


    const selectedModel = "Qwen2-0.5B-Instruct-q4f16_1-MLC";

    const engine = await CreateMLCEngine(
            selectedModel,
            { initProgressCallback: initProgressCallback }, // engineConfig
            );

            setEngine(engine)


    }

//     navigator.storage.estimate().then((e:any) => console.log("Limit (MB):", e?.quota / 1024 / 1024));



    return <div className={styles?.container}>

        {progress ? <div>{progress}</div> :  <button onClick={load_model}>Load Model</button>}
    </div>
    

}