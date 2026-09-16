import 'reactflow/dist/style.css';
import { useState } from 'react';
import ReactFlow, { MiniMap, Background, applyNodeChanges, addEdge } from 'reactflow';
import GlowNode from '../CustomNode/GlowNode';
import CommandCenter from '../CommandCenter/CommandCenter';
import NodeSidebar from '../Sidebar/NodeSidebar';
import { makeEdgeStyle } from '../../utils/edgeStyles';
import { NODE_CATEGORIES, categoryColor } from '../../utils/icons';
import './GraphCanvas.css';

const nodeTypes = { custom: GlowNode };

/**
 * Shared premium canvas for all four graph flavors.
 * Handles node/edge rendering, hover focus-mode, search dimming,
 * selection, layout switching, the Command Center and the sidebar.
 */
const GraphCanvas = ({ useGraph, directed, weighted }) => {
  const ctx = useGraph();
  const { nodes, setNodes, edges, setEdges } = ctx;

  const [instance, setInstance] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState('force');

  /* ---------- Node mutations (existing behavior, premium styling) ---------- */
  const addChild = (parentId, weight) => {
    const parentNode = nodes.find((node) => node.id === parentId);
    if (!parentNode) return;
    const newNodeId = `${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: { x: parentNode.position.x + 60, y: parentNode.position.y + 120 },
      data: {
        label: `Node ${newNodeId}`,
        category: NODE_CATEGORIES[nodes.length % NODE_CATEGORIES.length],
        weight: weight || undefined,
      },
    };
    const newEdge = {
      id: `e${parentId}-${newNodeId}`,
      source: parentId,
      target: newNodeId,
      ...makeEdgeStyle({ directed, category: 'cyan', weight: weight || undefined }),
    };
    setNodes((prev) => [...prev, newNode]);
    setEdges((prev) => [...prev, newEdge]);
  };

  const removeChild = (nodeId) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) => prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  /* ---------- Render-time normalization ---------- */
  const catOf = (id) => nodes.find((n) => n.id === id)?.data?.category || 'cyan';

  const displayNodes = nodes.map((node) => {
    const degree = edges.filter((e) => e.source === node.id || e.target === node.id).length;
    return {
      id: node.id,
      position: node.position,
      type: node.type,
      draggable: node.draggable,
      selected: node.selected,
      data: {
        ...node.data,
        category:
          node.data.category ||
          NODE_CATEGORIES[(Number(node.id) - 1) % NODE_CATEGORIES.length] ||
          'cyan',
        importance: node.data.importance || (degree >= 3 ? 'l' : 'm'),
        weight: node.weight ?? node.data.weight,
        degree,
        hovered: hoveredId === node.id,
        addChild,
        removeChild,
      },
    };
  });

  const displayEdges = edges.map((e) => ({
    ...e,
    ...makeEdgeStyle({ directed, category: catOf(e.source), weight: e.weight }),
  }));

  /* ---------- Hover focus-mode + search dimming ---------- */
  const nodeClassName = (n) => {
    if (searchQuery) {
      return (n.data.label || '').toLowerCase().includes(searchQuery.toLowerCase())
        ? 'hovered'
        : 'dimmed';
    }
    if (hoveredId) {
      if (n.id === hoveredId) return 'hovered';
      const related = new Set();
      edges.forEach((e) => {
        if (e.source === hoveredId) related.add(e.target);
        if (e.target === hoveredId) related.add(e.source);
      });
      return related.has(n.id) ? '' : 'dimmed';
    }
    return '';
  };

  const edgeClassName = (e) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const s = nodes.find((x) => x.id === e.source);
      const t = nodes.find((x) => x.id === e.target);
      return (s?.data.label || '').toLowerCase().includes(q) ||
        (t?.data.label || '').toLowerCase().includes(q)
        ? 'related'
        : '';
    }
    if (hoveredId) {
      return e.source === hoveredId || e.target === hoveredId ? 'related' : '';
    }
    return '';
  };

  /* ---------- Selection ---------- */
  const selectedNode = nodes.find((n) => n.selected) || null;
  const selectedEdge = edges.find((e) => e.selected) || null;

  const handleNodesChange = (changes) => setNodes((nds) => applyNodeChanges(changes, nds));
  const handleEdgesChange = (changes) => setEdges(changes);

  const clearSelection = () => {
    setNodes((prev) => prev.map((n) => ({ ...n, selected: false })));
    setEdges((prev) => prev.map((e) => ({ ...e, selected: false })));
  };

  const focusNode = (id) => {
    const n = nodes.find((x) => x.id === id);
    if (!n || !instance) return;
    instance.setCenter(n.position.x, n.position.y, { zoom: 1.25, duration: 800 });
    setNodes((prev) => prev.map((x) => ({ ...x, selected: x.id === id })));
    setEdges((prev) => prev.map((e) => ({ ...e, selected: false })));
  };

  /* ---------- Layout switch: Force ⇄ Hierarchy ---------- */
  const applyLayout = (mode) => {
    if (mode === 'toggle') mode = layoutMode === 'force' ? 'hierarchy' : 'force';
    setLayoutMode(mode);

    if (mode === 'force') {
      setTimeout(() => instance?.fitView({ padding: 0.25, duration: 800 }), 60);
      return;
    }

    const degree = (id) => edges.filter((e) => e.source === id || e.target === id).length;
    if (!nodes.length) return;
    const root = [...nodes].sort((a, b) => degree(b.id) - degree(a.id))[0].id;
    const depth = new Map([[root, 0]]);
    const queue = [root];
    while (queue.length) {
      const cur = queue.shift();
      const neighbors = [];
      edges.forEach((e) => {
        if (e.source === cur) neighbors.push(e.target);
        if (e.target === cur) neighbors.push(e.source);
      });
      neighbors.forEach((nb) => {
        if (!depth.has(nb)) {
          depth.set(nb, depth.get(cur) + 1);
          queue.push(nb);
        }
      });
    }
    const maxDepth = nodes.reduce((m, n) => Math.max(m, depth.get(n.id) ?? -1), 0);
    nodes.forEach((n) => {
      if (!depth.has(n.id)) depth.set(n.id, maxDepth + 1);
    });
    const cols = {};
    nodes.forEach((n) => {
      const d = depth.get(n.id);
      (cols[d] = cols[d] || []).push(n.id);
    });
    const positions = {};
    Object.entries(cols).forEach(([d, ids]) => {
      ids.forEach((id, i) => {
        positions[id] = { x: Number(d) * 280, y: (i - (ids.length - 1) / 2) * 150 };
      });
    });
    setNodes((prev) => prev.map((n) => ({ ...n, position: positions[n.id] })));
    setTimeout(() => instance?.fitView({ padding: 0.25, duration: 800 }), 80);
  };

  const onConnect = (params) =>
    setEdges((eds) => addEdge({ ...params, ...makeEdgeStyle({ directed, category: 'cyan' }) }, eds));

  return (
    <div className={`graph-page ${hoveredId || searchQuery ? 'focus-mode' : ''}`}>
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onInit={setInstance}
        onNodeMouseEnter={(_, n) => setHoveredId(n.id)}
        onNodeMouseLeave={() => setHoveredId(null)}
        onNodeClick={() =>
          setEdges((prev) => prev.map((e) => ({ ...e, selected: false })))
        }
        onEdgeClick={(event, edge) => {
          setNodes((prev) => prev.map((n) => ({ ...n, selected: false })));
          if (weighted && ctx.handleEdgeClick) ctx.handleEdgeClick(event, edge);
        }}
        onPaneClick={clearSelection}
        onConnect={directed ? undefined : onConnect}
        nodeTypes={nodeTypes}
        nodeClassName={nodeClassName}
        edgeClassName={edgeClassName}
      >
        <Background variant="dots" gap={28} size={1.5} color="var(--dot-grid)" />
        <MiniMap
          pannable
          zoomable
          nodeColor={(n) => categoryColor(n.data.category)}
          maskColor="rgba(11, 14, 20, 0.6)"
        />
      </ReactFlow>

      <div className="page-stats glass">
        <span>{nodes.length} nodes</span>
        <span className="page-stats-dot" />
        <span>{edges.length} edges</span>
        <span className="page-stats-dot" />
        <span className="page-stats-mode">{layoutMode}</span>
      </div>

      <CommandCenter
        instance={instance}
        onSearch={setSearchQuery}
        onLayoutMode={applyLayout}
        onFocusNode={focusNode}
        directed={directed}
        weighted={weighted}
      />

      <NodeSidebar
        node={selectedNode}
        edge={selectedEdge}
        ctx={ctx}
        isWeighted={weighted}
        isDirected={directed}
        onClose={clearSelection}
        onAddChild={addChild}
        onFocusNode={focusNode}
      />
    </div>
  );
};

export default GraphCanvas;
