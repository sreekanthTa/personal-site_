"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import { CreateServiceWorkerMLCEngine } from "@mlc-ai/web-llm";

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

  // Listen for progress messages from the service worker
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handleMessage = (evt: any) => {
      if (evt.data?.type === 'progress') {
        const p = evt.data.progress ?? 0;
        console.log('[webllm provider] Progress from SW:', p);
        setProgress(p);
        if (p >= 1) {
          console.log('[webllm provider] ✓ Model loading complete');
          setLoaded(true);
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, []);

  const createEngine = async () => {
    // Prevent multiple simultaneous creation attempts
    if (creatingRef.current) {
      console.log('[webllm provider] Engine creation already in progress, skipping...');
      return;
    }
    
    creatingRef.current = true;
    try {
      console.log('[webllm provider] Registering service worker...');
      await navigator.serviceWorker.register(
        new URL("./webllm.sw.js", import.meta.url),
        { type: "module" }
      );

      console.log('[webllm provider] Waiting for service worker to be ready...');
      
      // Add timeout to SW ready (5 seconds)
      const readyPromise = navigator.serviceWorker.ready;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Service worker ready timeout")), 5000)
      );
      
      await Promise.race([readyPromise, timeoutPromise]);
      console.log('[webllm provider] Service worker is ready');

      console.log('[webllm provider] Creating service worker engine...');
      const engine = await CreateServiceWorkerMLCEngine(
        "Qwen2-0.5B-Instruct-q4f16_1-MLC",
        {
          initProgressCallback: (p: any) => {
            const progressValue = p.progress ?? 0;
            console.log('[webllm provider] ✓ Progress callback:', progressValue);
            setProgress(progressValue);
            if (progressValue >= 1) {
              console.log('[webllm provider] ✓ Model loading complete');
              setLoaded(true);
            }
          },
        }
      );

      engineRef.current = engine;
      console.log('[webllm provider] ✓ Service worker engine created successfully!');
    } catch (err) {
      console.error('[webllm provider] Service worker failed, falling back to main-thread:', err);
      creatingRef.current = false;
      
      // Fallback to main-thread engine
      try {
        console.log('[webllm provider] Creating main-thread fallback engine...');
        const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
        const engine = await CreateMLCEngine('Qwen2-0.5B-Instruct-q4f16_1-MLC', {
          initProgressCallback: (p: any) => {
            const progressValue = p.progress ?? 0;
            console.log('[webllm provider] ✓ Fallback progress callback:', progressValue);
            setProgress(progressValue);
            if (progressValue >= 1) {
              console.log('[webllm provider] ✓ Fallback model loading complete');
              setLoaded(true);
            }
          },
        });
        engineRef.current = engine;
        console.log('[webllm provider] ✓ Fallback engine created successfully!');
        return;
      } catch (err2) {
        console.error('[webllm provider] Fallback engine also failed:', err2);
        throw err2;
      }
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
