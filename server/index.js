// Local development server for the code-run proxy.
// Usage: npm run server   →   http://localhost:4000
import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`GrapiFy code-run proxy listening on http://localhost:${PORT}`);
  console.log('POST /api/run-code  →  https://onecompiler.com/api/console/run');
});
