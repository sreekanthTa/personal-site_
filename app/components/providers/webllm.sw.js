import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

// The handler captures messages from the main thread and runs the engine
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg) => {
  handler.onmessage(msg);
};