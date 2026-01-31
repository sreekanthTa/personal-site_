// Service worker wrapper that dynamically imports the library from a CDN so the browser can resolve it without bundler support.
let handler = null;
let handlerReady = null;

function ensureHandler() {
  if (handlerReady) return handlerReady;
  handlerReady = (async () => {
    try {
      // Use esm.sh to get an ESM build that the browser can import
      const mod = await import('https://esm.sh/@mlc-ai/web-llm');
      const WebWorkerMLCEngineHandler = mod.WebWorkerMLCEngineHandler || mod.default?.WebWorkerMLCEngineHandler;
      if (!WebWorkerMLCEngineHandler) throw new Error('WebWorkerMLCEngineHandler not found in module');
      handler = new WebWorkerMLCEngineHandler();
      console.log('[webllm.sw] Handler initialized');
      self.postMessage({ type: 'handlerReady' });
    } catch (err) {
      try { self.postMessage({ type: 'error', error: String(err) }); } catch (e) {}
      throw err;
    }
  })();
  return handlerReady;
}

self.addEventListener('message', async (msg) => {
  try {
    await ensureHandler();
    console.log('[webllm.sw] Delegating message:', msg.data?.type);
    handler.onmessage(msg);
  } catch (err) {
    console.error('[webllm.sw] Error:', err);
    try {
      self.postMessage({ type: 'error', error: String(err) });
    } catch (e) {
      // ignore
    }
  }
});
