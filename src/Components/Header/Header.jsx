import './Header.css';
import { usePageContext } from '../../context/PageTracker/PageContext';
import { useTrack } from '../../context/Track/TrackContext';
import { NavLink } from 'react-router-dom';

const PAGES = [
  { to: '/', label: 'Overview' },
  { to: '/system-design', label: 'Systems workspace' },
  { to: '/dsa', label: 'DSA workspace' },
];

const PAGE_LABELS = {
  '/': 'Track overview',
  '/system-design': 'System Design workspace',
  '/dsa': 'DSA workspace',
  '/Directed-Unweighted-Graph': 'Directed Unweighted',
  '/Directed-Weighted-Graph': 'Directed Weighted',
  '/Undirected-Unweighted-Graph': 'Undirected Unweighted',
  '/Undirected-Weighted-Graph': 'Undirected Weighted',
};

/**
 * Floating brand pill: logo, current graph type, live node/edge counts
 * and compact graph-type tabs. All creation/editing UI lives in the
 * Command Center and the contextual sidebar now.
 */
const Header = () => {
  const { activePage, Context } = usePageContext();
  const { track } = useTrack();
  const ctx = Context ? Context() : null;

  return (
    <header className="brand-pill glass">
      <div className="brand-left">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="17" r="3" />
            <circle cx="17" cy="6" r="2" />
            <line x1="8.5" y1="7.5" x2="15.5" y2="15.5" />
            <line x1="8.6" y1="4.4" x2="15.4" y2="5.6" />
          </svg>
        </span>
        <div className="brand-titles">
          <span className="brand-name">GrapiFy</span>
          <span className="brand-page">{PAGE_LABELS[activePage] || `${track.name} workspace`}</span>
        </div>
      </div>

      <nav className="brand-nav" aria-label="Graph types">
        {PAGES.map((p) => (
          <NavLink
            key={p.to}
            to={p.to}
            end={p.to === '/'}
            className={({ isActive }) => (isActive ? 'brand-tab is-active' : 'brand-tab')}
          >
            {p.label}
          </NavLink>
        ))}
      </nav>

      <div className="brand-stats">
        <span>{ctx?.nodes?.length ?? 0} nodes</span>
        <span className="brand-dot" />
        <span>{ctx?.edges?.length ?? 0} edges</span>
      </div>
    </header>
  );
};

export default Header;
