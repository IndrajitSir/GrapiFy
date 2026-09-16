import { Suspense, lazy, useEffect, useLayoutEffect, useState } from 'react';
import GraphCanvas from '../Graph/GraphCanvas';
import EstimationCalculator from './EstimationCalculator';
import TradeoffPanel from './TradeoffPanel';
import WorkspaceNav from './WorkspaceNav';
import { useDirectedWeighted } from '../../context/DirectedWeighted/DirectedWeightedContext';
import './Workspace.css';
import './EstimationCalculator.css';
import './TradeoffPanel.css';

// Excalidraw is heavy → lazy-load JS + CSS into its own chunk.
const Excalidraw = lazy(() =>
  Promise.all([
    import('@excalidraw/excalidraw'),
    import('@excalidraw/excalidraw/index.css'),
  ]).then(([mod]) => ({ default: mod.Excalidraw }))
);

const STORAGE_KEY = 'grapify-whiteboard';

const loadWhiteboard = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted */ }
  return [];
};

/**
 * System Design workspace: blueprint-themed architecture studio.
 * Modes: Excalidraw whiteboard (canvas mode) + React Flow graph.
 * Right sidebar: estimation calculators + trade-off panel.
 */
const SystemDesignWorkspace = () => {
  const [mode, setMode] = useState('whiteboard');
  const [panel, setPanel] = useState('estimations');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [elements, setElements] = useState(loadWhiteboard);

  useLayoutEffect(() => {
    document.documentElement.dataset.workspace = 'system';
    document.title = 'System Design · GrapiFy';
    return () => {
      delete document.documentElement.dataset.workspace;
    };
  }, []);

  // Debounce persistence — Excalidraw fires onChange on every stroke.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(elements));
      } catch (e) { /* storage full — non fatal */ }
    }, 400);
    return () => clearTimeout(t);
  }, [elements]);

  return (
    <div className="workspace workspace-system">
      <header className="ws-toolbar glass">
        <div className="ws-title">
          <span className="ws-title-dot" />
          <div>
            <span className="ws-eyebrow">Architecture studio</span>
            <strong>System Design</strong>
          </div>
        </div>

        <WorkspaceNav />

        <nav className="ws-mode-tabs" aria-label="Canvas mode">
          <button
            className={mode === 'whiteboard' ? 'ws-mode-tab is-active' : 'ws-mode-tab'}
            onClick={() => setMode('whiteboard')}
          >
            Whiteboard
          </button>
          <button
            className={mode === 'graph' ? 'ws-mode-tab is-active' : 'ws-mode-tab'}
            onClick={() => setMode('graph')}
          >
            Architecture Graph
          </button>
        </nav>

        <button
          className={`ws-panel-toggle ${sidebarOpen ? 'is-active' : ''}`}
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          Tools
        </button>
      </header>

      <main className="ws-main">
        <section className="ws-canvas">
          {mode === 'whiteboard' ? (
            <Suspense fallback={<div className="ws-loading">Loading whiteboard…</div>}>
              <Excalidraw
                initialData={{ elements, appState: { viewBackgroundColor: 'transparent' } }}
                onChange={(els) => setElements(els)}
                UIOptions={{ canvasActions: { export: true, loadScene: true, saveAsImage: true } }}
              />
            </Suspense>
          ) : (
            <GraphCanvas useGraph={useDirectedWeighted} directed weighted />
          )}
        </section>

        <aside className={`ws-panel glass ${sidebarOpen ? 'is-open' : ''}`}>
          <nav className="ws-panel-tabs" aria-label="Sidebar tools">
            <button
              className={panel === 'estimations' ? 'is-active' : ''}
              onClick={() => setPanel('estimations')}
            >
              Estimations
            </button>
            <button
              className={panel === 'tradeoffs' ? 'is-active' : ''}
              onClick={() => setPanel('tradeoffs')}
            >
              Trade-offs
            </button>
          </nav>

          <div className="ws-panel-body">
            {panel === 'estimations' ? <EstimationCalculator /> : <TradeoffPanel />}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default SystemDesignWorkspace;
