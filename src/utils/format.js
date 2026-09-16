// Human-friendly number & byte formatting for estimation outputs.

export const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const abs = Math.abs(value);
  if (abs < 1000) return value.toFixed(value % 1 === 0 ? 0 : 1);
  const units = ['K', 'M', 'B', 'T', 'Q'];
  let unitIndex = -1;
  let scaled = value;
  while (Math.abs(scaled) >= 1000 && unitIndex < units.length - 1) {
    scaled /= 1000;
    unitIndex += 1;
  }
  return `${scaled.toFixed(scaled % 1 === 0 ? 0 : 1)}${units[unitIndex]}`;
};

export const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes)) return '—';
  const abs = Math.abs(bytes);
  if (abs < 1024) return `${bytes.toFixed(0)} B`;
  const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  let unitIndex = -1;
  let scaled = bytes;
  while (Math.abs(scaled) >= 1024 && unitIndex < units.length - 1) {
    scaled /= 1024;
    unitIndex += 1;
  }
  return `${scaled.toFixed(scaled % 1 === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const formatQps = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  if (value < 1) return `${value.toFixed(2)}/s`;
  return `${formatNumber(value)}/s`;
};
