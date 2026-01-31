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
    // Prevent multiple simultaneous creation attempts
    if (creatingRef.current) {
      console.log('[webllm provider] Engine creation already in progress, skipping...');
      return;
    }
    
    creatingRef.current = true;
    try {
      console.log('[webllm provider] Creating main-thread engine...');
      
      const engine = await CreateMLCEngine('Qwen2-0.5B-Instruct-q4f16_1-MLC', {
        initProgressCallback: (p: any) => {
          const progressValue = p.progress ?? 0;
          console.log('[webllm provider] ✓ Progress callback:', progressValue);
          setProgress(progressValue);
          // Mark as loaded when progress reaches 1 (100% in 0-1 range)
          if (progressValue >= 1) {
            console.log('[webllm provider] ✓ Model loading complete');
            setLoaded(true);
          }
        },
      });

      engineRef.current = engine;
      console.log('[webllm provider] ✓ Engine created successfully!');
    } catch (err) {
      console.error('[webllm provider] Engine creation failed:', err);
      creatingRef.current = false;
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
    if (!engineRef.current) {
      throw new Error("Model not loaded");
    }

    try {
      const chunks = await engineRef.current.chat.completions.create({
        messages,
        stream: true,
      });

      let full = "";

      for await (const chunk of chunks) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          full += delta;
          yield delta;
        }
      }

      return full;
    } catch (err) {
      // Service worker might have been killed — recreate engine
      engineRef.current = null;
      setLoaded(false);
      await createEngine();
      throw err;
    }
  }

  const chatCompletions = async (messages: Array<{ role: string; content: string }>) => {
    let result = "";
    for await (const chunk of chatCompletionsStream(messages)) {
      result += chunk;
    }
    return result;
  };

  return (
    <WebLLMContext.Provider
      value={{
        progress,
        isLoaded: loaded,
        loadModel,
        chatCompletions,
        chatCompletionsStream,
      }}
    >
      {children}
    </WebLLMContext.Provider>
  );
}
