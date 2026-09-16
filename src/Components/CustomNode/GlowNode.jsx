import { Handle } from 'reactflow';
import './GlowNode.css';
import { CATEGORIES } from '../../utils/icons';

/**
 * Premium glowing node: soft-gradient circle, SVG micro-icon, halo glow,
 * glass label chip, weight badge, hover tooltip and hover-reveal actions.
 */
const GlowNode = ({ id, data }) => {
  const {
    label,
    category = 'cyan',
    importance = 'm',
    addChild,
    removeChild,
    weightInput,
    weight,
    hovered,
    degree,
  } = data;

  const meta = CATEGORIES[category] || CATEGORIES.cyan;
  const Icon = meta.icon;
  const hasWeight = weight !== undefined && weight !== null && weight !== '';
  const highWeight = hasWeight && Number(weight) >= 10;

  return (
    <div className={`glow-node size-${importance} cat-${category} ${hovered ? 'is-hovered' : ''}`}>
      <Handle type="target" position="top" className="glow-handle" />

      <div className="gn-body">
        <Icon className="gn-icon" />
        <span className="gn-pulse" />
      </div>

      {hasWeight && (
        <span className={`gn-badge ${highWeight ? 'is-high' : ''}`}>{weight}</span>
      )}

      <div className="gn-label">{label}</div>

      {hovered && (
        <div className="gn-tooltip glass">
          <span className="gn-tt-name">{label}</span>
          <span className="gn-tt-meta">
            {degree !== undefined && degree !== null ? `degree ${degree}` : 'node'}
            {hasWeight ? ` · weight ${weight}` : ''}
          </span>
        </div>
      )}

      {addChild && (
        <div className="gn-actions">
          <button
            className="gn-action"
            title="Add child node"
            onClick={(e) => {
              e.stopPropagation();
              addChild(id, weightInput);
            }}
          >
            +
          </button>
          <button
            className="gn-action danger"
            title="Remove node"
            onClick={(e) => {
              e.stopPropagation();
              removeChild(id);
            }}
          >
            −
          </button>
        </div>
      )}

      <Handle type="source" position="bottom" className="glow-handle" />
    </div>
  );
};

export default GlowNode;
