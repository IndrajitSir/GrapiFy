// Vercel serverless function: exposes the Express proxy app as a single endpoint.
// Deployed to POST /api/run-code — keep this path in sync with src/Components/Workspace/CodeRunner.jsx
import app from '../server/app.js';

export default app;
