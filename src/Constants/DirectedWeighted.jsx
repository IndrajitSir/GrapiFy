export const initialNodes = [
  { id: '1', position: { x: 650, y: 100 }, data: { label: 'Node 1', category: 'cyan', importance: 'l' }, type: 'custom' },
  { id: '2', position: { x: 400, y: 200 }, data: { label: 'Node 2', category: 'purple', importance: 'm' }, type: 'custom' },
  { id: '3', position: { x: 800, y: 200 }, data: { label: 'Node 3', category: 'emerald', importance: 'm' }, draggable: true, type: 'custom' },
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', weight: 5 },
  { id: 'e1-3', source: '1', target: '3', weight: 10 },
];
