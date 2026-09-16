// Crisp stroke-based SVG micro-icons used inside graph nodes (Lucide-inspired).

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const ServerIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

export const DatabaseIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

export const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const CpuIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
  </svg>
);

export const WalletIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
  </svg>
);

export const CloudIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

export const GlobeIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// Node category metadata: gradient tones, halo, accent, icon, label.
export const NODE_CATEGORIES = ['cyan', 'purple', 'emerald', 'amber', 'rose'];

export const CATEGORIES = {
  cyan: {
    icon: ServerIcon,
    tint: '#67e8f9',
    deep: '#0891b2',
    halo: 'rgba(34, 211, 238, 0.32)',
    accent: '#22d3ee',
    label: 'Server',
  },
  purple: {
    icon: DatabaseIcon,
    tint: '#c4b5fd',
    deep: '#7c3aed',
    halo: 'rgba(167, 139, 250, 0.32)',
    accent: '#a78bfa',
    label: 'Database',
  },
  emerald: {
    icon: UserIcon,
    tint: '#6ee7b7',
    deep: '#059669',
    halo: 'rgba(52, 211, 153, 0.32)',
    accent: '#34d399',
    label: 'User',
  },
  amber: {
    icon: CpuIcon,
    tint: '#fcd34d',
    deep: '#d97706',
    halo: 'rgba(251, 191, 36, 0.32)',
    accent: '#fbbf24',
    label: 'Compute',
  },
  rose: {
    icon: WalletIcon,
    tint: '#fda4af',
    deep: '#e11d48',
    halo: 'rgba(251, 113, 133, 0.32)',
    accent: '#fb7185',
    label: 'Wallet',
  },
};

export const categoryColor = (category) => (CATEGORIES[category] || CATEGORIES.cyan).accent;

const uiIcon = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const NetworkIcon = (props) => (
  <svg viewBox="0 0 24 24" {...uiIcon} {...props}>
    <circle cx="12" cy="5" r="3" /><circle cx="5" cy="18" r="3" /><circle cx="19" cy="18" r="3" />
    <path d="m10.5 7.5-4 7.5M13.5 7.5l4 7.5M8 18h8" />
  </svg>
);

export const TreeIcon = (props) => (
  <svg viewBox="0 0 24 24" {...uiIcon} {...props}>
    <circle cx="12" cy="5" r="2.5" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" />
    <path d="M12 7.5V12M12 12H6v3.5M12 12h6v3.5" />
  </svg>
);

export const CodeIcon = (props) => (
  <svg viewBox="0 0 24 24" {...uiIcon} {...props}>
    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
  </svg>
);

export const GitForkIcon = (props) => (
  <svg viewBox="0 0 24 24" {...uiIcon} {...props}>
    <circle cx="6" cy="5" r="2.5" /><circle cx="18" cy="19" r="2.5" /><circle cx="18" cy="5" r="2.5" />
    <path d="M6 7.5v3a5 5 0 0 0 5 5h4M18 7.5v9" />
  </svg>
);

export const IconMap = {
  server: ServerIcon,
  database: DatabaseIcon,
  network: NetworkIcon,
  cloud: CloudIcon,
  tree: TreeIcon,
  code: CodeIcon,
  fork: GitForkIcon,
  cpu: CpuIcon,
};
