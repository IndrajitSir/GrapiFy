import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Overview' },
  { to: '/system-design', label: 'System Design' },
  { to: '/dsa', label: 'DSA' },
];

/**
 * Compact top-nav used inside workspace toolbars
 * (the global brand pill is hidden while a workspace is active).
 */
const WorkspaceNav = () => (
  <nav className="ws-nav" aria-label="Workspaces">
    {LINKS.map((l) => (
      <NavLink
        key={l.to}
        to={l.to}
        end={l.to === '/'}
        className={({ isActive }) => (isActive ? 'ws-nav-link is-active' : 'ws-nav-link')}
      >
        {l.label}
      </NavLink>
    ))}
  </nav>
);

export default WorkspaceNav;
