import { useEffect, useMemo, useState } from 'react';
import { TrackContext } from './TrackContext';

const STORAGE_KEY = 'grapify-track';

export const TRACKS = {
  system: {
    id: 'system',
    name: 'System Design',
    shortName: 'Systems',
    eyebrow: 'Architecture studio',
    title: 'Design systems that scale.',
    description: 'Map the invisible infrastructure behind reliable products — from request flows to resilient data layers.',
    accent: 'emerald',
    icon: 'server',
    modules: [
      { id: 'architecture', title: 'Architecture patterns', description: 'Compose services, queues, caches, and boundaries into a clear system map.', icon: 'network', meta: '12 patterns', progress: 72, to: '/system-design' },
      { id: 'data', title: 'Data & storage', description: 'Explore durable schemas, replication strategies, and consistency trade-offs.', icon: 'database', meta: '8 modules', progress: 48, to: '/system-design' },
      { id: 'cloud', title: 'Cloud infrastructure', description: 'Trace traffic through regions, gateways, workers, and observability layers.', icon: 'cloud', meta: '6 modules', progress: 31, to: '/system-design' },
    ],
  },
  dsa: {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    shortName: 'DSA',
    eyebrow: 'Problem-solving lab',
    title: 'Make complexity feel simple.',
    description: 'Build intuition through visual flows for data structures, algorithms, and the decisions behind efficient code.',
    accent: 'violet',
    icon: 'tree',
    modules: [
      { id: 'structures', title: 'Core structures', description: 'Visualize arrays, linked lists, trees, graphs, and how data moves through them.', icon: 'tree', meta: '18 structures', progress: 64, to: '/dsa' },
      { id: 'algorithms', title: 'Algorithm flows', description: 'Step through traversal, sorting, recursion, and greedy decision paths.', icon: 'code', meta: '24 algorithms', progress: 42, to: '/dsa' },
      { id: 'complexity', title: 'Complexity clinic', description: 'Compare runtime and memory costs with interactive, visual reasoning.', icon: 'cpu', meta: '9 challenges', progress: 26, to: '/dsa' },
    ],
  },
};

export const TrackProvider = ({ children }) => {
  const [trackId, setTrackId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'system';
    } catch {
      return 'system';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.track = trackId;
    try {
      localStorage.setItem(STORAGE_KEY, trackId);
    } catch {
      // Persistence is an enhancement; the in-memory state still works.
    }
  }, [trackId]);

  const value = useMemo(() => ({
    trackId,
    track: TRACKS[trackId] || TRACKS.system,
    setTrackId,
    tracks: TRACKS,
  }), [trackId]);

  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
};