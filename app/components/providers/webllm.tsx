"use client";
import React, { createContext, useContext, useRef, useState } from "react";
import { CreateWebWorkerMLCEngine, MLCEngineInterface } from "@mlc-ai/web-llm";

export interface WebLLMContextType {
  progress: string;
  isLoaded: boolean;
  loadModel: () => Promise<void>;
  engine: MLCEngineInterface | null;
}

export const WebLLMContext = createContext<WebLLMContextType | undefined>(undefined);

export default function WebLLMProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const engineRef = useRef<MLCEngineInterface | null>(null);

  const loadModel = async () => {
    if (engineRef.current || typeof window === "undefined") return;

    // 1. Setup the standard Web Worker
    const worker = new Worker(new URL("./webllm.sw.js", import.meta.url), {
      type: "module",
    });

    // 2. Use the WebLLM factory (handles all postMessage logic automatically)
    const engine = await CreateWebWorkerMLCEngine(
      worker,
      "Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC", // Or your preferred model
      {
        initProgressCallback: (p:any) => {
            console.log("progress is",p  )
            setProgress(p.progress)},
      }
    );

    engineRef.current = engine;
    setIsLoaded(true);
  };

  return (
    <WebLLMContext.Provider value={{ progress, isLoaded, loadModel, engine: engineRef.current }}>
      {children}
    </WebLLMContext.Provider>
  );
}

// Custom Hook to use the engine easily
export const useWebLLM = () => {
  const context = useContext(WebLLMContext);
  if (!context) throw new Error("useWebLLM must be used within a WebLLMProvider");
  return context;
};
