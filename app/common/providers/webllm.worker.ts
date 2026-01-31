import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

// This handler fully manages messages for you
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};
