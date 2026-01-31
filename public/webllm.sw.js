// webllm.sw.js (classic service worker)

let handler = null;

// Load library synchronously at the top level
try {
  console.log("[webllm.sw] Loading library with importScripts...");
  importScripts("https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.48/dist/web-llm.js");
  console.log("[webllm.sw] Library loaded");
} catch (err) {
  console.error("[webllm.sw] Failed to load library:", err);
}

self.addEventListener("activate", (event) => {
  console.log("[webllm.sw] activated");
  
  // Initialize handler after activation
  if (self.ServiceWorkerMLCEngineHandler) {
    handler = new self.ServiceWorkerMLCEngineHandler();
    console.log("[webllm.sw] handler created");
  } else {
    console.error("[webllm.sw] ServiceWorkerMLCEngineHandler not found");
  }
});

self.addEventListener("message", (event) => {
  if (!handler) {
    console.warn("[webllm.sw] handler not ready yet");
    return;
  }
  handler.onmessage(event);
});
