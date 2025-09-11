export const initialNodes = [
  { id: '1', position: { x: 650, y: 100 }, data: { label: 'Node 1' }, style: { Background: '#9CA8B3', color: 'blue'/*, width: 70, height: 35*/ }, type: 'custom' },
  { id: '2', position: { x: 400, y: 200 }, data: { label: 'Node 2' }, type: 'custom' },
  { id: '3', position: { x: 800, y: 200 }, data: { label: 'Node 3' }, draggable: true, type: 'custom' },
];

export const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: 'arrow', color: 'red' }, style: { stroke: 'blue', strokeWidth: 2 }, weight: 5, label: "5" },
  { id: 'e1-3', source: '1', target: '3', animated: true, markerEnd: { type: 'arrow', color: 'red' }, style: { stroke: 'blue', strokeWidth: 2 }, weight: 10, label: "10" },
];
