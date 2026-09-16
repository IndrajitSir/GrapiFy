import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrack } from '../../context/Track/TrackContext';
import { IconMap } from '../../utils/icons';
import './TrackDashboard.css';

const Chevron = ({ open }) => (
  <svg className={open ? 'track-chevron is-open' : 'track-chevron'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M7 7h10v10" />
  </svg>
);

const TrackDashboard = () => {
  const { track, tracks, setTrackId } = useTrack();
  const [open, setOpen] = useState(false);
  const selectorRef = useRef(null);
  const AccentIcon = IconMap[track.icon] || IconMap.server;
  const FeaturedIcon = IconMap[track.modules[0].icon] || IconMap.server;

  useEffect(() => {
    document.title = `${track.name} · GrapiFy`;
  }, [track.name]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!selectorRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectTrack = (id) => {
    setTrackId(id);
    setOpen(false);
  };

  return (
    <main className={`track-dashboard track-${track.accent}`}>
      <div className="dashboard-orb dashboard-orb-one" />
      <div className="dashboard-orb dashboard-orb-two" />
      <section className="dashboard-content">
        <div className="dashboard-hero">
          <div className="dashboard-eyebrow">
            <span className="status-pulse" />
            {track.eyebrow}
          </div>
          <div className="dashboard-hero-row">
            <div className="dashboard-copy">
              <h1>{track.title}</h1>
              <p>{track.description}</p>
            </div>
            <div className="track-selector-wrap" ref={selectorRef}>
              <button
                className="track-selector glass"
                type="button"
                aria-expanded={open}
                aria-haspopup="listbox"
                onClick={() => setOpen((current) => !current)}
              >
                <span className="track-selector-icon"><AccentIcon /></span>
                <span className="track-selector-copy">
                  <span className="track-selector-label">Current track</span>
                  <strong>{track.name}</strong>
                </span>
                <Chevron open={open} />
              </button>
              {open && (
                <div className="track-menu glass" role="listbox" aria-label="Choose engineering track">
                  {Object.values(tracks).map((option) => {
                    const OptionIcon = IconMap[option.icon] || IconMap.server;
                    const active = option.id === track.id;
                    return (
                      <button
                        className={`track-option ${active ? 'is-active' : ''}`}
                        type="button"
                        role="option"
                        aria-selected={active}
                        key={option.id}
                        onClick={() => selectTrack(option.id)}
                      >
                        <span className={`track-option-icon ${option.accent}`}><OptionIcon /></span>
                        <span className="track-option-copy">
                          <strong>{option.name}</strong>
                          <small>{option.eyebrow}</small>
                        </span>
                        {active && <span className="track-option-check">●</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <Link className="module-card module-featured glass" to={track.modules[0].to}>
            <div className="module-card-top">
              <span className="module-icon"><FeaturedIcon /></span>
              <span className="module-arrow"><ArrowUpRight /></span>
            </div>
            <div className="module-card-body">
              <span className="module-kicker">Featured module</span>
              <h2>{track.modules[0].title}</h2>
              <p>{track.modules[0].description}</p>
            </div>
            <div className="module-progress">
              <div className="module-progress-meta"><span>{track.modules[0].meta}</span><b>{track.modules[0].progress}%</b></div>
              <span className="progress-track"><span style={{ width: `${track.modules[0].progress}%` }} /></span>
            </div>
          </Link>

          {track.modules.slice(1).map((module) => {
            const ModuleIcon = IconMap[module.icon];
            return (
              <Link className="module-card module-standard glass" to={module.to} key={module.id}>
                <div className="module-card-top">
                  <span className="module-icon"><ModuleIcon /></span>
                  <span className="module-arrow"><ArrowUpRight /></span>
                </div>
                <span className="module-kicker">{module.meta}</span>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <span className="module-link">Open workspace <ArrowUpRight /></span>
              </Link>
            );
          })}

          <div className="module-card module-stats glass">
            <span className="module-kicker">Your momentum</span>
            <div className="momentum-number">{Math.round(track.modules.reduce((sum, module) => sum + module.progress, 0) / track.modules.length)}<small>%</small></div>
            <p>Average track progress</p>
            <div className="momentum-bars">
              {track.modules.map((module) => <span key={module.id} style={{ height: `${Math.max(18, module.progress)}%` }} />)}
            </div>
          </div>

          <Link className="module-card module-cta" to={track.id === 'system' ? '/system-design' : '/dsa'}>
            <span className="cta-glow" />
            <span className="module-kicker">Ready when you are</span>
            <h3>Enter the {track.shortName} workspace</h3>
            <span className="cta-button">Launch workspace <ArrowUpRight /></span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default TrackDashboard;