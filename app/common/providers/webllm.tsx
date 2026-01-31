"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { CreateMLCEngine } from "@mlc-ai/web-llm";

export interface WebLLMContextType {
  progress: number;
  isLoaded: boolean;
  loadModel: () => Promise<void>;
  chatCompletions: (messages: Array<{ role: string; content: string }>) => Promise<string>;
  chatCompletionsStream: (
    messages: Array<{ role: string; content: string }>
  ) => AsyncGenerator<string, string, unknown>;
}

export const WebLLMContext = createContext<WebLLMContextType | undefined>(undefined);

export function useWebLLM() {
  const ctx = useContext(WebLLMContext);
  if (!ctx) throw new Error("useWebLLM must be used within WebLLMProvider");
  return ctx;
}

export default function WebLLMProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef<any>(null);
  const creatingRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);



  const createEngine = async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;

    try {
      console.log("[webllm provider] Creating main-thread engine...");

      const engine = await CreateMLCEngine(
        "Qwen2-0.5B-Instruct-q4f16_1-MLC",
        {
          initProgressCallback: (p: any) => {
            const progressValue = p.progress ?? 0;
            console.log("[webllm provider] Progress:", progressValue);
            setProgress(progressValue);
            if (progressValue >= 1) {
              console.log("[webllm provider] Model loaded!");
              setLoaded(true);
            }
          },
        }
      );

      engineRef.current = engine;
      console.log("[webllm provider] Engine created");
    } catch (err) {
      console.error("[webllm provider] Engine creation failed:", err);
      throw err;
    } finally {
      creatingRef.current = false;
    }
  };

  const loadModel = async () => {
    if (engineRef.current) return;
    await createEngine();
  };

  async function* chatCompletionsStream(
    messages: Array<{ role: string; content: string }>
  ): AsyncGenerator<string, string, unknown> {
    if (!engineRef.current) throw new Error("Model not loaded");

    const stream = await engineRef.current.chat.completions.create({
      messages,
      stream: true,
    });

    let full = "";
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      if (delta) {
        full += delta;
        yield delta;
      }
    }
    return full;
  }

  const chatCompletions = async (messages: Array<{ role: string; content: string }>) => {
    let result = "";
    for await (const chunk of chatCompletionsStream(messages)) {
      result += chunk;
    }
    return result;
  };

  return (
    <WebLLMContext.Provider value={{ progress, isLoaded: loaded, loadModel, chatCompletions, chatCompletionsStream }}>
      {children}
    </WebLLMContext.Provider>
  );
}
