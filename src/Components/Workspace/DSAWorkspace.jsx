import { Suspense, lazy, useLayoutEffect, useState } from 'react';
import ComplexityAnalyzer from './ComplexityAnalyzer';
import Visualizer from './Visualizer';
import WorkspaceNav from './WorkspaceNav';
import './DSAWorkspace.css';

// Monaco is heavy → keep it out of the initial bundle.
const CodeRunner = lazy(() => import('./CodeRunner'));

/**
 * DSA workspace: terminal-themed coding lab.
 * Main: Monaco editor + OneCompiler console.
 * Right sidebar: complexity tracker + step visualizer.
 */
const DSAWorkspace = () => {
  const [panel, setPanel] = useState('complexity');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useLayoutEffect(() => {
    document.documentElement.dataset.workspace = 'dsa';
    document.title = 'DSA · GrapiFy';
    return () => {
      delete document.documentElement.dataset.workspace;
    };
  }, []);

  return (
    <div className="workspace workspace-dsa">
      <header className="ws-toolbar glass">
        <div className="ws-title">
          <span className="ws-title-dot" />
          <div>
            <span className="ws-eyebrow">Problem-solving lab</span>
            <strong>Data Structures & Algorithms</strong>
          </div>
        </div>

        <WorkspaceNav />

        <div className="ws-title ws-toolbar-hint">
          <span className="ws-eyebrow">Editor</span>
          <strong className="ws-mono-hint">code → run → trace</strong>
        </div>

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
        <section className="ws-canvas dsa-main">
          <div className="dsa-editor-area">
            <Suspense fallback={<div className="dsa-editor-loading">Loading editor…</div>}>
              <CodeRunner />
            </Suspense>
          </div>
        </section>

        <aside className={`ws-panel glass ${sidebarOpen ? 'is-open' : ''}`}>
          <nav className="ws-panel-tabs" aria-label="Sidebar tools">
            <button
              className={panel === 'complexity' ? 'is-active' : ''}
              onClick={() => setPanel('complexity')}
            >
              Complexity
            </button>
            <button
              className={panel === 'visualizer' ? 'is-active' : ''}
              onClick={() => setPanel('visualizer')}
            >
              Visualizer
            </button>
          </nav>

          <div className="ws-panel-body">
            {panel === 'complexity' ? <ComplexityAnalyzer /> : <Visualizer />}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default DSAWorkspace;
