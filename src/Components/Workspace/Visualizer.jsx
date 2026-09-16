import { useMemo, useState } from 'react';
import './Visualizer.css';

/* ---------- Trace generators ---------- */

const binarySearchSteps = (arr, target) => {
  let low = 0;
  let high = arr.length - 1;
  const steps = [];
  let i = 0;
  while (low <= high && i < 200) {
    const mid = Math.floor((low + high) / 2);
    steps.push({
      low,
      high,
      mid,
      array: arr,
      action: `Compare a[${mid}] = ${arr[mid]} with target ${target}`,
    });
    if (arr[mid] === target) {
      steps.push({ low, high, mid, array: arr, found: true, action: `Target found at index ${mid}!` });
      return steps;
    }
    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
    i += 1;
  }
  steps.push({ low, high, mid: null, array: arr, notFound: true, action: 'Target not present.' });
  return steps;
};

const insertionSortSteps = (arr) => {
  const a = [...arr];
  const steps = [{ array: [...a], i: 0, j: null, key: null, action: 'Initial array' }];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({ array: [...a], i, j, key, action: `Pick key = ${key} (index ${i})` });
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      steps.push({ array: [...a], i, j, key, action: `Shift a[${j}] = ${a[j]} one step right` });
      j -= 1;
    }
    a[j + 1] = key;
    steps.push({ array: [...a], i, j: j + 1, key, action: `Insert ${key} at index ${j + 1}` });
  }
  steps.push({ array: [...a], i: null, j: null, key: null, action: 'Array sorted.' });
  return steps;
};

const parseArray = (text) =>
  text
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));

/* ---------- SVG binary tree ---------- */

const buildBST = (arr) => {
  let root = null;
  const insert = (node, value) => {
    if (!node) return { value, left: null, right: null };
    if (value < node.value) node.left = insert(node.left, value);
    else node.right = insert(node.right, value);
    return node;
  };
  arr.forEach((v) => { root = insert(root, v); });
  return root;
};

// In-order x layout, depth y layout.
const layoutTree = (root) => {
  const nodes = [];
  let cursor = 0;
  const walk = (node, depth, path) => {
    if (!node) return;
    walk(node.left, depth + 1, [...path, 'L']);
    nodes.push({ ...node, x: cursor, y: depth, path });
    cursor += 1;
    walk(node.right, depth + 1, [...path, 'R']);
  };
  walk(root, 0, []);
  const depths = new Map();
  nodes.forEach((n) => depths.set(n.y, (depths.get(n.y) || 0) + 1));
  const maxDepth = nodes.reduce((m, n) => Math.max(m, n.y), 0);
  const W = 520;
  const H = Math.max(180, maxDepth * 70 + 90);
  const NODE_R = 18;
  const positioned = nodes.map((n) => ({
    ...n,
    px: ((n.x + 1) / (cursor + 1)) * W,
    py: n.y * 70 + 50,
  }));
  return { positioned, W, H, NODE_R };
};

/* ---------- Visualizer ---------- */

const MODES = [
  { id: 'trace', label: 'Trace table' },
  { id: 'tree', label: 'Tree view' },
];

const ALGOS = [
  { id: 'binary', label: 'Binary search', stepFn: binarySearchSteps, needTarget: true },
  { id: 'insertion', label: 'Insertion sort', stepFn: insertionSortSteps, needTarget: false },
];

const Visualizer = () => {
  const [mode, setMode] = useState('trace');
  const [algoId, setAlgoId] = useState('binary');
  const [arrayText, setArrayText] = useState('3, 8, 12, 17, 22, 41, 55');
  const [target, setTarget] = useState('22');
  const [stepIndex, setStepIndex] = useState(0);
  const [treeArrayText, setTreeArrayText] = useState('50, 30, 70, 20, 40, 60, 80');
  const [searchVal, setSearchVal] = useState('');
  const [highlightPath, setHighlightPath] = useState([]);

  const algo = ALGOS.find((a) => a.id === algoId);
  const arr = useMemo(() => parseArray(arrayText), [arrayText]);
  const targetNum = Number(target);

  const steps = useMemo(() => {
    const clean = arr.length ? arr : [0];
    return algo.stepFn(clean, algo.needTarget && !Number.isNaN(targetNum) ? targetNum : clean[0]);
  }, [algo, arr, targetNum]);

  const reset = () => setStepIndex(0);
  const step = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));
  const jump = (v) => setStepIndex(v);

  // Jump straight to the result when inputs change
  const runAll = () => setStepIndex(steps.length - 1);

  const colCount = steps[0]?.array?.length ?? arr.length;

  const tree = useMemo(() => buildBST(parseArray(treeArrayText)), [treeArrayText]);
  const treeData = useMemo(() => layoutTree(tree), [tree]);

  const searchTree = () => {
    const targetValue = Number(searchVal);
    if (Number.isNaN(targetValue)) return;
    const path = [];
    let node = tree;
    while (node) {
      path.push(node.value);
      if (targetValue === node.value) break;
      node = targetValue < node.value ? node.left : node.right;
    }
    setHighlightPath(path);
  };

  return (
    <div className="viz-widget">
      <div className="viz-modes">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={mode === m.id ? 'is-active' : ''}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'trace' && (
        <div className="viz-trace">
          <div className="viz-controls">
            <label className="viz-field">
              <span>Algorithm</span>
              <select value={algoId} onChange={(e) => { setAlgoId(e.target.value); setStepIndex(0); }}>
                {ALGOS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </label>
            <label className="viz-field">
              <span>Array (comma-separated)</span>
              <input value={arrayText} onChange={(e) => { setArrayText(e.target.value); setStepIndex(0); }} />
            </label>
            {algo.needTarget && (
              <label className="viz-field">
                <span>Target</span>
                <input value={target} onChange={(e) => { setTarget(e.target.value); setStepIndex(0); }} />
              </label>
            )}
          </div>

          <div className="viz-step-actions">
            <button className="viz-btn" onClick={reset}>⟲ Reset</button>
            <button className="viz-btn" onClick={back} disabled={stepIndex === 0}>← Back</button>
            <button className="viz-btn" onClick={runAll}>Skip</button>
            <button className="viz-btn primary" onClick={step} disabled={stepIndex >= steps.length - 1}>
              Next →
            </button>
          </div>

          <div className="viz-bar">
            {steps.map((_, i) => (
              <button
                key={i}
                className={`viz-bar-seg ${i === stepIndex ? 'is-active' : ''} ${i < stepIndex ? 'is-done' : ''}`}
                onClick={() => jump(i)}
                title={`Step ${i + 1}`}
              />
            ))}
          </div>

          <div className="viz-table-wrap">
            <table className="viz-table">
              <thead>
                <tr>
                  <th>Step</th>
                  {Array.from({ length: colCount }, (_, idx) => <th key={idx}>a[{idx}]</th>)}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((s, i) => (
                  <tr key={i} className={i === stepIndex ? 'is-current' : ''}>
                    <td className="viz-step-num">{i + 1}</td>
                    {Array.from({ length: colCount }, (_, idx) => (
                      <td key={idx} className={s.mid === idx ? 'is-mid' : s.i === idx ? 'is-key' : s.j === idx ? 'is-j' : ''}>
                        {s.array[idx] ?? '·'}
                      </td>
                    ))}
                    <td className="viz-action">{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {mode === 'tree' && (
        <div className="viz-tree">
          <div className="viz-controls">
            <label className="viz-field">
              <span>Array → BST</span>
              <input value={treeArrayText} onChange={(e) => { setTreeArrayText(e.target.value); setHighlightPath([]); }} />
            </label>
            <label className="viz-field">
              <span>Search value (highlights path)</span>
              <input value={searchVal} onChange={(e) => setSearchVal(e.target.value)} />
            </label>
            <button className="viz-btn primary" onClick={searchTree}>Search</button>
          </div>
          <svg viewBox={`0 0 ${treeData.W} ${treeData.H}`} className="viz-svg">
            {treeData.positioned.map((n) => {
              const children = treeData.positioned.filter((c) => {
                const isLeft = n.left && c.value === n.left.value;
                const isRight = n.right && c.value === n.right.value;
                return isLeft || isRight;
              });
              return children.map((c) => (
                <line
                  key={`${n.value}-${c.value}`}
                  x1={n.px}
                  y1={n.py}
                  x2={c.px}
                  y2={c.py}
                  className="viz-edge"
                />
              ));
            })}
            {treeData.positioned.map((n) => {
              const onPath = highlightPath.includes(n.value);
              const isTarget = highlightPath.length > 0 && highlightPath[highlightPath.length - 1] === n.value;
              return (
                <g key={n.value} transform={`translate(${n.px},${n.py})`}>
                  <circle
                    r={treeData.NODE_R}
                    className={`viz-node ${onPath ? (isTarget ? 'is-target' : 'is-path') : ''}`}
                  />
                  <text y="4" textAnchor="middle" className="viz-node-text">
                    {n.value}
                  </text>
                </g>
              );
            })}
          </svg>
          {highlightPath.length > 0 && (
            <div className="viz-path">
              Search path: {highlightPath.join(' → ')}
              {highlightPath[highlightPath.length - 1] !== Number(searchVal) && ' (not found)'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Visualizer;
