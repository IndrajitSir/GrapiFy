import { useEffect, useState } from 'react';
import './CommandCenter.css';
import { usePageContext } from '../../context/PageTracker/PageContext';
import { makeEdgeStyle } from '../../utils/edgeStyles';
import { NODE_CATEGORIES } from '../../utils/icons';

/* ---------- Minimal inline UI icons ---------- */
const ic = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const IconLink = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
);
const IconZoomIn = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
);
const IconZoomOut = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
);
const IconFit = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
);
const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconLayers = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></svg>
);
const IconDownload = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
);
const IconMoon = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
);
const IconSun = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></svg>
);
const IconClose = (p) => (
  <svg viewBox="0 0 24 24" {...ic} {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

const download = (content, filename, mime = 'application/json') => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Floating Command Center: global dock with Add Node / Add Edge,
 * zoom controls, search, layout switch, export and theme toggle.
 */
const CommandCenter = ({ instance, onSearch, onLayoutMode, onFocusNode, directed, weighted }) => {
  const { Context } = usePageContext();
  const ctx = Context();
  const nodes = ctx?.nodes || [];
  const setNodes = ctx?.setNodes;
  const edges = ctx?.edges || [];
  const setEdges = ctx?.setEdges;

  const [dialog, setDialog] = useState(null); // 'node' | 'edge' | null
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [exportOpen, setExportOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'dark'
  );

  // Edge dialog form
  const [src, setSrc] = useState('');
  const [tgt, setTgt] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('');
  const [err, setErr] = useState('');

  // Node dialog form
  const [nodeName, setNodeName] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('gf-theme', theme);
    } catch (e) { /* ignore */ }
  }, [theme]);

  const zoom = (factor) => {
    if (!instance) return;
    if (factor > 0) instance.zoomIn({ duration: 200 });
    else instance.zoomOut({ duration: 200 });
  };
  const fitView = () => instance?.fitView({ padding: 0.25, duration: 600 });

  const submitNode = (e) => {
    e.preventDefault();
    const name = nodeName.trim();
    if (!setNodes) return;
    const id = `${nodes.length + 1}`;
    const newNode = {
      id,
      type: 'custom',
      position: { x: 180 + (nodes.length % 5) * 48, y: 160 + (nodes.length % 4) * 56 },
      data: {
        label: name || `Node ${id}`,
        category: NODE_CATEGORIES[nodes.length % NODE_CATEGORIES.length],
      },
    };
    setNodes((prev) => [...prev, newNode]);
    setNodeName('');
    setDialog(null);
  };

  const submitEdge = (e) => {
    e.preventDefault();
    setErr('');
    if (!src || !tgt) return setErr('Select both source and target node.');
    if (src === tgt) return setErr('Source and target must be different.');
    if (!setEdges) return;
    if (edges.some((edge) => edge.source === src && edge.target === tgt)) {
      return setErr('This edge already exists.');
    }
    const newEdge = {
      id: `e${src}-${tgt}`,
      source: src,
      target: tgt,
      ...makeEdgeStyle({ directed, category: 'cyan', weight: weighted ? edgeWeight : undefined }),
    };
    setEdges((prev) => [...prev, newEdge]);
    setSrc('');
    setTgt('');
    setEdgeWeight('');
    setDialog(null);
  };

  const openDialog = (type) => {
    setDialog(type);
    setErr('');
    if (type === 'edge') {
      setSrc('');
      setTgt('');
      setEdgeWeight('');
    } else {
      setNodeName('');
    }
  };

  const exportJSON = () => {
    if (!instance) return;
    download(JSON.stringify(instance.toObject(), null, 2), 'grapify-graph.json');
    setExportOpen(false);
  };

  const exportPNG = () => {
    setExportOpen(false);
    const container = document.querySelector('.react-flow');
    const viewport = document.querySelector('.react-flow__viewport');
    if (!container || !viewport) return;
    const rect = container.getBoundingClientRect();
    const body =
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
      `width="${rect.width}" height="${rect.height}">` +
      `<foreignObject width="100%" height="100%">` +
      `${new XMLSerializer().serializeToString(viewport)}` +
      `</foreignObject></svg>`;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = rect.width;
      canvas.height = rect.height;
      const c = canvas.getContext('2d');
      c.fillStyle = getComputedStyle(container).backgroundColor || '#0b0e14';
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'grapify-graph.png';
      a.click();
    };
    img.onerror = () => exportJSON();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(body);
  };

  const matches = query.trim()
    ? nodes.filter((n) => (n.data.label || '').toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  const toggleLayout = () => {
    onLayoutMode?.('toggle');
    setSearchOpen(false);
  };

  return (
    <>
      {/* ---------- Dock ---------- */}
      <div className="cc-dock glass" onClick={(e) => e.stopPropagation()}>
        <div className="cc-cluster">
          <button className="cc-btn" title="Add node" onClick={() => openDialog('node')}>
            <IconPlus />
          </button>
          <button className="cc-btn" title="Add edge" onClick={() => openDialog('edge')}>
            <IconLink />
          </button>
        </div>

        <span className="cc-sep" />

        <div className="cc-cluster">
          <button className="cc-btn" title="Zoom out" onClick={() => zoom(-1)}>
            <IconZoomOut />
          </button>
          <button className="cc-btn" title="Zoom in" onClick={() => zoom(1)}>
            <IconZoomIn />
          </button>
          <button className="cc-btn" title="Fit to screen" onClick={fitView}>
            <IconFit />
          </button>
        </div>

        <span className="cc-sep" />

        <div className="cc-cluster">
          <button
            className={`cc-btn ${searchOpen ? 'is-active' : ''}`}
            title="Search nodes (filters the graph)"
            onClick={() => {
              setSearchOpen((v) => !v);
              setExportOpen(false);
            }}
          >
            <IconSearch />
          </button>
          <button className="cc-btn" title="Switch layout (Force ⇄ Hierarchy)" onClick={toggleLayout}>
            <IconLayers />
          </button>
          <div className="cc-relative">
            <button
              className={`cc-btn ${exportOpen ? 'is-active' : ''}`}
              title="Export graph"
              onClick={() => {
                setExportOpen((v) => !v);
                setSearchOpen(false);
              }}
            >
              <IconDownload />
            </button>
            {exportOpen && (
              <div className="cc-menu glass">
                <button className="cc-menu-item" onClick={exportJSON}>Export JSON</button>
                <button className="cc-menu-item" onClick={exportPNG}>Export PNG</button>
              </div>
            )}
          </div>
          <button
            className="cc-btn"
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </div>

      {/* ---------- Search palette ---------- */}
      {searchOpen && (
        <div className="cc-search glass" onClick={(e) => e.stopPropagation()}>
          <div className="cc-search-input">
            <IconSearch />
            <input
              autoFocus
              placeholder="Search nodes — filters the graph…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch(e.target.value);
              }}
            />
            <button className="cc-btn cc-search-close" title="Close" onClick={() => { setSearchOpen(false); onSearch(''); }}>
              <IconClose />
            </button>
          </div>
          {query.trim() !== '' && (
            <div className="cc-results">
              {matches.length === 0 && <div className="cc-empty">No matching nodes</div>}
              {matches.map((n) => (
                <button
                  key={n.id}
                  className="cc-result"
                  onClick={() => {
                    onFocusNode(n.id);
                    setQuery('');
                    setSearchOpen(false);
                  }}
                >
                  <span className={`cc-result-dot cat-${n.data.category || 'cyan'}`} />
                  <span className="cc-result-name">{n.data.label}</span>
                  <span className="cc-result-id">#{n.id}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------- Glass dialogs ---------- */}
      {dialog && (
        <div className="cc-overlay" onClick={() => setDialog(null)}>
          <div className="cc-dialog glass" onClick={(e) => e.stopPropagation()}>
            <div className="cc-dialog-head">
              <h3>{dialog === 'node' ? 'Add Node' : 'Add Edge'}</h3>
              <button className="cc-btn" title="Close" onClick={() => setDialog(null)}>
                <IconClose />
              </button>
            </div>

            {dialog === 'node' ? (
              <form onSubmit={submitNode}>
                <label className="cc-field">
                  <span>Node name</span>
                  <input
                    autoFocus
                    placeholder={`Node ${nodes.length + 1}`}
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                  />
                </label>
                <div className="cc-dialog-actions">
                  <button type="button" className="cc-ghost" onClick={() => setDialog(null)}>Cancel</button>
                  <button type="submit" className="cc-primary">Add Node</button>
                </div>
              </form>
            ) : (
              <form onSubmit={submitEdge}>
                <label className="cc-field">
                  <span>Source node</span>
                  <select value={src} onChange={(e) => setSrc(e.target.value)}>
                    <option value="">Select source…</option>
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>{n.data.label || `Node ${n.id}`}</option>
                    ))}
                  </select>
                </label>
                <label className="cc-field">
                  <span>Target node</span>
                  <select value={tgt} onChange={(e) => setTgt(e.target.value)}>
                    <option value="">Select target…</option>
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>{n.data.label || `Node ${n.id}`}</option>
                    ))}
                  </select>
                </label>
                {weighted && (
                  <label className="cc-field">
                    <span>Edge weight</span>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      value={edgeWeight}
                      onChange={(e) => setEdgeWeight(e.target.value)}
                    />
                  </label>
                )}
                {err && <div className="cc-error">{err}</div>}
                <div className="cc-dialog-actions">
                  <button type="button" className="cc-ghost" onClick={() => setDialog(null)}>Cancel</button>
                  <button type="submit" className="cc-primary">Add Edge</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Page label badge (top-right mini stat) is rendered by the graph page itself */}
    </>
  );
};

export default CommandCenter;
