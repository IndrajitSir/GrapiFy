import { useEffect, useState } from 'react';
import './ComplexityAnalyzer.css';

const STORAGE_KEY = 'grapify-complexity';

const BIG_O = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)', 'O(n!)'];

const bigOTone = (o) => {
  const idx = BIG_O.indexOf(o);
  if (idx <= 1) return 'fast';
  if (idx <= 3) return 'ok';
  if (idx === 4) return 'slow';
  return 'awful';
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted */ }
  return [
    { id: 'seed-1', problem: 'Binary search', time: 'O(log n)', space: 'O(1)', notes: 'Sorted array, iterative version' },
    { id: 'seed-2', problem: 'Merge sort', time: 'O(n log n)', space: 'O(n)', notes: 'Divide & conquer, stable' },
    { id: 'seed-3', problem: 'BFS on graph', time: 'O(V+E)', space: 'O(V)', notes: 'Adjacency list representation' },
  ];
};

const uid = () => `c-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;

/**
 * Complexity Analyzer: log and track Big-O time/space for problems.
 */
const ComplexityAnalyzer = () => {
  const [entries, setEntries] = useState(load);
  const [problem, setProblem] = useState('');
  const [time, setTime] = useState('O(n)');
  const [space, setSpace] = useState('O(1)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) { /* storage full */ }
  }, [entries]);

  const add = (e) => {
    e.preventDefault();
    if (!problem.trim()) return;
    setEntries((prev) => [
      { id: uid(), problem: problem.trim(), time, space, notes: notes.trim() },
      ...prev,
    ]);
    setProblem('');
    setNotes('');
  };

  const remove = (id) => setEntries((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="cx-widget">
      <form className="cx-form" onSubmit={add}>
        <label className="cx-field">
          <span>Problem / function</span>
          <input
            placeholder="e.g. Two-sum hash map"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
          />
        </label>
        <div className="cx-row">
          <label className="cx-field">
            <span>Time</span>
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              {BIG_O.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label className="cx-field">
            <span>Space</span>
            <select value={space} onChange={(e) => setSpace(e.target.value)}>
              {BIG_O.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
        </div>
        <label className="cx-field">
          <span>Notes</span>
          <input
            placeholder="Trade-offs, constraints…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <button type="submit" className="cx-add">+ Log complexity</button>
      </form>

      <div className="cx-list">
        {entries.map((entry) => (
          <div key={entry.id} className="cx-card">
            <div className="cx-card-head">
              <strong>{entry.problem}</strong>
              <button onClick={() => remove(entry.id)} title="Delete">✕</button>
            </div>
            <div className="cx-badges">
              <span className={`cx-badge ${bigOTone(entry.time)}`}>{entry.time}</span>
              <span className={`cx-badge ${bigOTone(entry.space)}`}>{entry.space}</span>
            </div>
            {entry.notes && <p className="cx-notes">{entry.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplexityAnalyzer;
