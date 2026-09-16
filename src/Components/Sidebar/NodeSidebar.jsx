import { useEffect, useState } from 'react';
import './NodeSidebar.css';
import { CATEGORIES } from '../../utils/icons';

const IconClose = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * Mini sparkline of connected edge weights.
 */
const Sparkline = ({ values, color }) => {
  const pts = values && values.length >= 2 ? values : [0, 0];
  const w = 100;
  const h = 32;
  const max = Math.max(...pts.map((v) => Number(v) || 0), 1);
  const step = w / (pts.length - 1);
  const line = pts
    .map((v, i) => `${(i * step).toFixed(1)},${(h - 4 - ((Number(v) || 0) / max) * (h - 8)).toFixed(1)}`)
    .join(' ');
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sb-spark" preserveAspectRatio="none">
      <polygon points={area} fill={color} opacity="0.18" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/**
 * Contextual slide-out sidebar shown when a node or edge is selected.
 */
const NodeSidebar = ({ node, edge, ctx, isWeighted, isDirected, onClose, onAddChild, onFocusNode }) => {
  const [label, setLabel] = useState(node?.data?.label || '');

  useEffect(() => {
    setLabel(node?.data?.label || '');
  }, [node]);

  const nodes = ctx?.nodes || [];
  const edges = ctx?.edges || [];
  const setNodes = ctx?.setNodes;
  const setEdges = ctx?.setEdges;

  const open = Boolean(node || edge);

  const degreeOf = (id) => {
    const inDeg = edges.filter((e) => e.target === id).length;
    const outDeg = edges.filter((e) => e.source === id).length;
    return { in: inDeg, out: outDeg, total: inDeg + outDeg };
  };

  const connectionsOf = (id) =>
    edges
      .filter((e) => e.source === id || e.target === id)
      .map((e) => {
        const otherId = e.source === id ? e.target : e.source;
        const other = nodes.find((n) => n.id === otherId);
        return { edge: e, other, otherId };
      });

  const saveLabel = () => {
    if (!node || !setNodes) return;
    const text = label.trim() || node.data.label;
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, label: text } } : n))
    );
  };

  const removeNode = () => {
    if (!node || !setNodes || !setEdges) return;
    setNodes((prev) => prev.filter((n) => n.id !== node.id));
    setEdges((prev) => prev.filter((e) => e.source !== node.id && e.target !== node.id));
    onClose();
  };

  const removeEdge = () => {
    if (!edge || !setEdges) return;
    setEdges((prev) => prev.filter((e) => e.id !== edge.id));
    onClose();
  };

  // --- Node view data ---
  const meta = node ? CATEGORIES[node.data?.category] || CATEGORIES.cyan : null;
  const degree = node ? degreeOf(node.id) : null;
  const connections = node ? connectionsOf(node.id) : [];
  const sparkValues = node
    ? connections.map((c) => c.edge.weight).filter((w) => w !== undefined && w !== '')
    : [];

  // --- Edge view data ---
  const srcNode = edge ? nodes.find((n) => n.id === edge.source) : null;
  const tgtNode = edge ? nodes.find((n) => n.id === edge.target) : null;

  return (
    <aside className={`sb-panel glass ${open ? 'is-open' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className="sb-head">
        <div className="sb-title">
          {node && meta && (
            <span className="sb-node-dot" style={{ background: meta.accent }}>
              {(() => {
                const Icon = meta.icon;
                return <Icon className="sb-node-ic" />;
              })()}
            </span>
          )}
          {edge && <span className="sb-node-dot sb-edge-dot">↔</span>}
          <div>
            <div className="sb-eyebrow">{node ? 'Node' : 'Edge'} details</div>
            <h3>{node ? node.data.label : `Edge ${edge?.id || ''}`}</h3>
          </div>
        </div>
        <button className="sb-close" title="Close panel" onClick={onClose}>
          <IconClose />
        </button>
      </div>

      {node && (
        <>
          {/* Metadata card */}
          <div className="sb-card">
            <div className="sb-card-label">Metadata</div>
            <div className="sb-grid">
              <div className="sb-cell">
                <span>ID</span>
                <b>{node.id}</b>
              </div>
              <div className="sb-cell">
                <span>Type</span>
                <b>{meta.label}</b>
              </div>
              {isDirected ? (
                <>
                  <div className="sb-cell">
                    <span>In-degree</span>
                    <b>{degree.in}</b>
                  </div>
                  <div className="sb-cell">
                    <span>Out-degree</span>
                    <b>{degree.out}</b>
                  </div>
                </>
              ) : (
                <div className="sb-cell">
                  <span>Degree</span>
                  <b>{degree.total}</b>
                </div>
              )}
              {isWeighted && (
                <div className="sb-cell">
                  <span>Weight</span>
                  <b>{node.weight ?? '—'}</b>
                </div>
              )}
            </div>
          </div>

          {/* Metrics / sparkline card */}
          {sparkValues.length >= 2 && (
            <div className="sb-card">
              <div className="sb-card-label">Edge weight trend</div>
              <Sparkline values={sparkValues} color={meta.accent} />
              <div className="sb-cell sb-inline">
                <span>Range</span>
                <b>
                  {Math.min(...sparkValues.map(Number))} – {Math.max(...sparkValues.map(Number))}
                </b>
              </div>
            </div>
          )}

          {/* Connections card */}
          <div className="sb-card">
            <div className="sb-card-label">
              Connections <span className="sb-count">{connections.length}</span>
            </div>
            <div className="sb-connections">
              {connections.length === 0 && <div className="sb-empty">No connected nodes</div>}
              {connections.map(({ edge: e, other }) => (
                <button
                  key={e.id}
                  className="sb-conn"
                  onClick={() => other && onFocusNode(other.id)}
                >
                  <span
                    className="sb-conn-dot"
                    style={{
                      background: CATEGORIES[other?.data?.category]?.accent || 'var(--accent-cyan)',
                    }}
                  />
                  <span className="sb-conn-name">{other?.data?.label || 'Unknown'}</span>
                  {isWeighted && e.weight !== undefined && e.weight !== '' && (
                    <span className="sb-conn-weight">{e.weight}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="sb-card">
            <div className="sb-card-label">Actions</div>
            <label className="sb-field">
              <span>Label</span>
              <div className="sb-field-row">
                <input value={label} onChange={(e) => setLabel(e.target.value)} />
                <button className="sb-mini" onClick={saveLabel}>Save</button>
              </div>
            </label>
            <div className="sb-actions">
              <button
                className="sb-action"
                onClick={() => {
                  onAddChild(node.id);
                  onClose();
                }}
              >
                + Add child
              </button>
              <button className="sb-action danger" onClick={removeNode}>
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {!node && edge && (
        <>
          <div className="sb-card">
            <div className="sb-card-label">Path</div>
            <div className="sb-path">
              <span className="sb-path-node">{srcNode?.data?.label || edge.source}</span>
              <span className="sb-path-arrow">{isDirected ? '→' : '—'}</span>
              <span className="sb-path-node">{tgtNode?.data?.label || edge.target}</span>
            </div>
            <div className="sb-grid">
              <div className="sb-cell">
                <span>ID</span>
                <b>{edge.id}</b>
              </div>
              {isWeighted && (
                <div className="sb-cell">
                  <span>Weight</span>
                  <b>{edge.weight ?? '—'}</b>
                </div>
              )}
            </div>
          </div>

          {isWeighted && ctx?.handleWeightChange && (
            <div className="sb-card">
              <div className="sb-card-label">Edit weight</div>
              <label className="sb-field">
                <span>New weight</span>
                <div className="sb-field-row">
                  <input
                    type="number"
                    value={ctx.weightInput ?? ''}
                    onChange={ctx.handleWeightChange}
                  />
                  <button
                    className="sb-mini"
                    onClick={() => {
                      ctx.handleUpdateWeight();
                      onClose();
                    }}
                  >
                    Update
                  </button>
                </div>
              </label>
            </div>
          )}

          <div className="sb-card">
            <div className="sb-card-label">Actions</div>
            <div className="sb-actions">
              <button className="sb-action danger" onClick={removeEdge}>
                Delete edge
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default NodeSidebar;
