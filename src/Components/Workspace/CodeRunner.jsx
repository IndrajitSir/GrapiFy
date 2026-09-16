import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import './CodeRunner.css';

// Wire up Monaco workers for Vite.
self.MonacoEnvironment = {
  getWorker: () => new editorWorker(),
};
loader.config({ monaco });

const Editor = lazy(() => import('@monaco-editor/react'));

// Same-origin route served by the Express proxy (server/app.js).
// Vercel: api/run-code.js · Local dev: Vite proxies /api → http://localhost:4000
const RUN_ENDPOINT = '/api/run-code';

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', file: 'main.js', template: 'console.log("Hello, World!");\n' },
  { id: 'typescript', name: 'TypeScript', file: 'main.ts', template: 'console.log("Hello, World!");\n' },
  { id: 'python', name: 'Python', file: 'main.py', template: 'print("Hello, World!")\n' },
  {
    id: 'java',
    name: 'Java',
    file: 'Main.java',
    template: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
  },
  { id: 'c', name: 'C', file: 'main.c', template: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n' },
  { id: 'cpp', name: 'C++', file: 'main.cpp', template: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n' },
  { id: 'go', name: 'Go', file: 'main.go', template: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n' },
  { id: 'rust', name: 'Rust', file: 'main.rs', template: 'fn main() {\n    println!("Hello, World!");\n}\n' },
];

const MONACO_LANG = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  go: 'go',
  rust: 'rust',
};

/**
 * Stream a OneCompiler NDJSON response: each line is a JSON object.
 * Extract stdout/stderr "data" and the final "exit" summary.
 */
const readNDJSONStream = async (response, onMessage) => {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line) continue;
      try {
        onMessage(JSON.parse(line));
      } catch (e) {
        onMessage({ type: 'error', data: `Unparseable response line: ${line}` });
      }
    }
  }
  if (buffer.trim()) {
    try {
      onMessage(JSON.parse(buffer.trim()));
    } catch (e) { /* trailing garbage */ }
  }
};

/**
 * DSA Code Runner: Monaco editor + OneCompiler console (NDJSON stream).
 */
const CodeRunner = () => {
  const [langId, setLangId] = useState('javascript');
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState(null);
  const consoleRef = useRef(null);

  const lang = LANGUAGES.find((l) => l.id === langId);
  const canRun = code.trim().length > 0;

  useEffect(() => {
    consoleRef.current?.scrollTo({ top: consoleRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  const switchLanguage = (id) => {
    const next = LANGUAGES.find((l) => l.id === id);
    setLangId(id);
    setCode(next.template);
    setLogs([]);
    setSummary(null);
  };

  const run = async () => {
    if (!canRun || running) return;
    setRunning(true);
    setLogs([{ kind: 'system', text: `Running ${lang.name}…` }]);
    setSummary(null);
    try {
      const res = await fetch(RUN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang.id,
          files: [{ name: lang.file, content: code }],
        }),
      });
      if (!res.ok) {
        setLogs((prev) => [
          ...prev,
          { kind: 'error', text: `Request failed: HTTP ${res.status} ${res.statusText}` },
        ]);
        return;
      }
      await readNDJSONStream(res, (msg) => {
        if (msg.type === 'stdout' || msg.type === 'stderr') {
          setLogs((prev) => [...prev, { kind: msg.type === 'stderr' ? 'error' : 'output', text: msg.data || '' }]);
        } else if (msg.type === 'error') {
          setLogs((prev) => [...prev, { kind: 'error', text: msg.data || 'Unknown error' }]);
        } else if (msg.type === 'exit') {
          setSummary({
            exitCode: msg.exitCode,
            executionTime: msg.executionTime,
          });
        }
      });
    } catch (err) {
      setLogs((prev) => [
        ...prev,
        {
          kind: 'error',
          text: `Failed to reach the code runner: ${err.message}. Make sure the Express proxy is running locally (npm run server) or that /api/run-code is deployed.`,
        },
      ]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="runner">
      <div className="runner-bar">
        <div className="runner-lang">
          <label>Language</label>
          <select value={langId} onChange={(e) => switchLanguage(e.target.value)}>
            {LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
          <span className="runner-file">{lang.file}</span>
        </div>
        <div className="runner-actions">
          <button className="runner-clear" onClick={() => { setLogs([]); setSummary(null); }}>
            Clear
          </button>
          <button className="runner-run" disabled={!canRun || running} onClick={run}>
            {running ? (
              <><span className="runner-spinner" /> Running…</>
            ) : (
              <>▶ Run Code</>
            )}
          </button>
        </div>
      </div>

      <div className="runner-editor">
        <Suspense fallback={<div className="runner-loading">Loading editor…</div>}>
          <Editor
            height="100%"
            language={MONACO_LANG[langId]}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v || '')}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', ui-monospace, Consolas, monospace",
              minimap: { enabled: false },
              padding: { top: 14 },
              scrollBeyondLastLine: false,
              tabSize: 2,
              automaticLayout: true,
            }}
          />
        </Suspense>
      </div>

      <div className="runner-console">
        <div className="runner-console-head">
          <span>Console</span>
          {summary && (
            <span className={`runner-exit ${summary.exitCode === 0 ? 'ok' : 'fail'}`}>
              exit {summary.exitCode} · {summary.executionTime}ms
            </span>
          )}
        </div>
        <div className="runner-console-body" ref={consoleRef}>
          {logs.length === 0 && <div className="runner-console-empty">Output will appear here.</div>}
          {logs.map((log, i) => (
            <div key={i} className={`runner-log ${log.kind}`}>
              {log.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeRunner;
