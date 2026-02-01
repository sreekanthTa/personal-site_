import { CreateMLCEngine } from "@mlc-ai/web-llm";

let engine: any = null;

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === "LOAD_MODEL") {
    try {
      console.log("[webllm.worker] Loading model...");
      
      engine = await CreateMLCEngine(
        "SmolLM2-360M-Instruct-q4f16_1-MLC",
        {
          initProgressCallback: (p: any) => {
            const progressValue = p.progress ?? 0;
            console.log("[webllm.worker] Progress:", progressValue);
            self.postMessage({
              type: "PROGRESS",
              progress: progressValue,
            });
          },
        }
      );

      console.log("[webllm.worker] Model loaded!");
      self.postMessage({ type: "MODEL_LOADED" });
    } catch (err) {
      console.error("[webllm.worker] Error loading model:", err);
      self.postMessage({
        type: "ERROR",
        error: String(err),
      });
    }
  } else if (type === "CHAT_STREAM") {
    const { messages } = payload;
    try {
      if (!engine) {
        throw new Error("Model not loaded");
      }

      const stream = await engine.chat.completions.create({
        messages,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          self.postMessage({
            type: "CHAT_DELTA",
            delta,
          });
        }
      }

      self.postMessage({ type: "CHAT_COMPLETE" });
    } catch (err) {
      console.error("[webllm.worker] Chat error:", err);
      self.postMessage({
        type: "ERROR",
        error: String(err),
      });
    }
  }
};
