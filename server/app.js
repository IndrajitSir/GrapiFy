// Shared Express app: proxies POST /api/run-code to the OneCompiler console API.
// Used both locally (server/index.js) and as a Vercel serverless function (api/run-code.js).
import express from 'express';

const app = express();

// CORS for local dev when Vite (5173) and this proxy (4000) are on different ports.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '256kb' }));

app.post('/api/run-code', async (req, res) => {
  const { language, files } = req.body || {};
  if (!language || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: 'Missing "language" or "files" in the request body.' });
  }

  let upstream;
  try {
    upstream = await fetch('https://onecompiler.com/api/console/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, files }),
    });
  } catch (err) {
    return res.status(502).json({ error: `Upstream request failed: ${err.message}` });
  }

  res.status(upstream.status);
  const contentType = upstream.headers.get('content-type');
  if (contentType) res.setHeader('Content-Type', contentType);

  // Stream the NDJSON lines back to the client as they arrive
  // (preserves the progressive stdout console in the UI).
  const reader = upstream.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
    }
  } catch (err) {
    // Client may have disconnected mid-stream — nothing else to do.
  } finally {
    res.end();
  }
});

export default app;
