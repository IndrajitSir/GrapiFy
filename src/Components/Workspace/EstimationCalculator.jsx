import { useMemo, useState } from 'react';
import { formatNumber, formatBytes, formatQps } from '../../utils/format';

const DEFAULT_INPUTS = {
  dau: 1000000,
  requestsPerUserPerDay: 10,
  peakFactor: 2,
  writeSizeKb: 2,
  writesPerUserPerDay: 1,
  retentionDays: 365,
  replication: 3,
  readWriteRatio: 9,
  responseSizeKb: 100,
};

const FIELD_DEFS = [
  { key: 'dau', label: 'Daily Active Users (DAU)', min: 1, step: 1000, hint: 'Unique users per day' },
  { key: 'requestsPerUserPerDay', label: 'Requests / user / day', min: 1, step: 1, hint: 'Average actions per user' },
  { key: 'peakFactor', label: 'Peak-to-average factor', min: 1, step: 0.5, hint: '× burst at peak hour' },
  { key: 'writesPerUserPerDay', label: 'Writes / user / day', min: 0, step: 1, hint: 'Persistent writes per user' },
  { key: 'writeSizeKb', label: 'Avg write size (KB)', min: 0.1, step: 0.5, hint: 'Per stored object/row' },
  { key: 'responseSizeKb', label: 'Avg response size (KB)', min: 1, step: 10, hint: 'Payload served to clients' },
  { key: 'readWriteRatio', label: 'Read : write ratio', min: 1, step: 1, hint: 'Reads per single write' },
  { key: 'retentionDays', label: 'Retention (days)', min: 1, step: 30, hint: 'How long data is kept' },
  { key: 'replication', label: 'Replication factor', min: 1, step: 1, hint: 'Copies of each object' },
];

const NumberField = ({ def, value, onChange }) => (
  <label className="est-field">
    <span className="est-field-label">
      {def.label}
      <em>{def.hint}</em>
    </span>
    <input
      type="number"
      min={def.min}
      step={def.step}
      value={value}
      onChange={(e) => onChange(def.key, Number(e.target.value))}
    />
  </label>
);

/**
 * Back-of-the-envelope estimation calculator:
 * QPS, storage and bandwidth from DAU-scale inputs.
 */
const EstimationCalculator = () => {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  const setInput = (key, value) => setInputs((prev) => ({ ...prev, [key]: value }));
  const reset = () => setInputs(DEFAULT_INPUTS);

  const out = useMemo(() => {
    const SECONDS_PER_DAY = 86400;
    const avgQps = (inputs.dau * inputs.requestsPerUserPerDay) / SECONDS_PER_DAY;
    const peakQps = avgQps * inputs.peakFactor;
    const writeQps = (inputs.dau * inputs.writesPerUserPerDay) / SECONDS_PER_DAY;
    const readQps = writeQps * inputs.readWriteRatio;
    const storagePerDayBytes = writeQps * inputs.writeSizeKb * 1024 * SECONDS_PER_DAY * inputs.replication;
    const storageTotalBytes = storagePerDayBytes * inputs.retentionDays;
    const bandwidthBytesPerSec =
      (readQps * inputs.responseSizeKb + writeQps * inputs.writeSizeKb) * 1024 * inputs.peakFactor;
    return { avgQps, peakQps, writeQps, readQps, storagePerDayBytes, storageTotalBytes, bandwidthBytesPerSec };
  }, [inputs]);

  const rows = [
    { label: 'Average QPS', value: formatQps(out.avgQps), tone: 'accent' },
    { label: 'Peak QPS', value: formatQps(out.peakQps), tone: 'accent' },
    { label: 'Write QPS', value: formatQps(out.writeQps), tone: '' },
    { label: 'Read QPS', value: formatQps(out.readQps), tone: '' },
    { label: 'Storage / day', value: formatBytes(out.storagePerDayBytes), tone: '' },
    { label: `Storage / ${inputs.retentionDays}d`, value: formatBytes(out.storageTotalBytes), tone: 'accent' },
    { label: 'Bandwidth (peak)', value: `${formatBytes(out.bandwidthBytesPerSec)}/s`, tone: 'accent' },
  ];

  return (
    <div className="est-widget">
      <div className="est-form">
        {FIELD_DEFS.map((def) => (
          <NumberField key={def.key} def={def} value={inputs[def.key]} onChange={setInput} />
        ))}
        <button className="est-reset" onClick={reset}>
          Reset defaults
        </button>
      </div>

      <div className="est-outputs">
        {rows.map((row) => (
          <div key={row.label} className={`est-row ${row.tone}`}>
            <span>{row.label}</span>
            <b>{row.value}</b>
          </div>
        ))}
      </div>

      <p className="est-note">
        Formulas: QPS = DAU × actions ÷ 86,400 · storage = write QPS × size × 86,400 ×
        replication · bandwidth = (read QPS × response + write QPS × write) × peak factor.
      </p>
    </div>
  );
};

export default EstimationCalculator;
