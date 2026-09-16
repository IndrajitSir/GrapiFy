import { useEffect, useState } from 'react';

const STORAGE_KEY = 'grapify-tradeoffs';

const seedDecisions = () => [
  {
    id: 'seed-1',
    title: 'SQL vs NoSQL',
    context: 'Primary datastore for a social feed service with heavy read amplification.',
    pros: ['ACID transactions', 'Ad-hoc joins & rich queries', 'Mature tooling & managed offerings'],
    cons: ['Vertical scaling ceiling', 'Schema migrations are disruptive', 'Read replicas lag under load'],
    verdict: 'Start with PostgreSQL; introduce Redis cache and move hot feeds to Cassandra only if write fan-out exceeds 50k QPS.',
  },
];

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted storage — fall through */ }
  return seedDecisions();
};

const uid = () => `d-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;

const TextList = ({ label, value, onChange }) => (
  <label className="tf-field">
    <span>{label}</span>
    <textarea
      rows={3}
      placeholder="One item per line"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);

/**
 * Trade-off panel: structured pros/cons for architectural decisions.
 */
const TradeoffPanel = () => {
  const [decisions, setDecisions] = useState(load);
  const [editing, setEditing] = useState(null); // decision id or 'new'
  const [form, setForm] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
    } catch (e) { /* storage full — non fatal */ }
  }, [decisions]);

  const startNew = () => {
    setForm({ id: 'new', title: '', context: '', pros: '', cons: '', verdict: '' });
    setEditing('new');
  };

  const startEdit = (d) => {
    setForm({
      ...d,
      pros: d.pros.join('\n'),
      cons: d.cons.join('\n'),
    });
    setEditing(d.id);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const entry = {
      id: editing === 'new' ? uid() : editing,
      title: form.title.trim(),
      context: form.context.trim(),
      pros: form.pros.split('\n').map((s) => s.trim()).filter(Boolean),
      cons: form.cons.split('\n').map((s) => s.trim()).filter(Boolean),
      verdict: form.verdict.trim(),
    };
    setDecisions((prev) =>
      editing === 'new'
        ? [entry, ...prev]
        : prev.map((d) => (d.id === editing ? entry : d))
    );
    setEditing(null);
    setForm(null);
  };

  const remove = (id) => setDecisions((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="tf-widget">
      <div className="tf-actions">
        <button className="tf-add" onClick={startNew}>
          + New decision
        </button>
        {decisions.length > 0 && (
          <button
            className="tf-reset"
            onClick={() => {
              if (window.confirm('Reset all trade-off entries?')) setDecisions(seedDecisions());
            }}
          >
            Reset
          </button>
        )}
      </div>

      {editing && form && (
        <form className="tf-form" onSubmit={save}>
          <label className="tf-field">
            <span>Decision title</span>
            <input
              autoFocus
              placeholder="e.g. SQL vs NoSQL"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="tf-field">
            <span>Context</span>
            <textarea
              rows={2}
              placeholder="What are we deciding, and under what constraints?"
              value={form.context}
              onChange={(e) => setForm({ ...form, context: e.target.value })}
            />
          </label>
          <TextList label="Pros (one per line)" value={form.pros} onChange={(v) => setForm({ ...form, pros: v })} />
          <TextList label="Cons (one per line)" value={form.cons} onChange={(v) => setForm({ ...form, cons: v })} />
          <label className="tf-field">
            <span>Verdict / notes</span>
            <textarea
              rows={2}
              placeholder="Decision, rationale, follow-ups…"
              value={form.verdict}
              onChange={(e) => setForm({ ...form, verdict: e.target.value })}
            />
          </label>
          <div className="tf-form-actions">
            <button type="button" className="tf-cancel" onClick={() => { setEditing(null); setForm(null); }}>
              Cancel
            </button>
            <button type="submit" className="tf-save">Save</button>
          </div>
        </form>
      )}

      <div className="tf-list">
        {decisions.length === 0 && <div className="tf-empty">No decisions yet — add your first trade-off.</div>}
        {decisions.map((d) => (
          <div key={d.id} className="tf-card">
            <div className="tf-card-head">
              <div>
                <h4>{d.title}</h4>
                {d.context && <p>{d.context}</p>}
              </div>
              <div className="tf-card-actions">
                <button onClick={() => startEdit(d)}>Edit</button>
                <button className="danger" onClick={() => remove(d.id)}>Delete</button>
              </div>
            </div>
            <div className="tf-columns">
              <div className="tf-col pros">
                <span className="tf-col-label">Pros</span>
                {d.pros.map((p, i) => <div key={i} className="tf-item">{p}</div>)}
              </div>
              <div className="tf-col cons">
                <span className="tf-col-label">Cons</span>
                {d.cons.map((c, i) => <div key={i} className="tf-item">{c}</div>)}
              </div>
            </div>
            {d.verdict && (
              <div className="tf-verdict">
                <strong>Verdict</strong>
                <p>{d.verdict}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeoffPanel;
