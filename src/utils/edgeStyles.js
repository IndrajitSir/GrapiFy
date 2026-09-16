// Unified edge styling: thin elegant Beziers, theme-adaptive colors,
// rounded directional arrows and animated dash-flow, plus weight chips.

const DEFAULT_CATEGORY = 'cyan';

// Edge strokes use CSS variables so colors adapt to the active theme.
export const EDGE_VARS = {
  cyan: 'var(--edge-cyan)',
  purple: 'var(--edge-purple)',
  emerald: 'var(--edge-emerald)',
  amber: 'var(--edge-amber)',
  rose: 'var(--edge-rose)',
};

/**
 * Build the visual layer of an edge.
 * @param {{directed?: boolean, category?: string, weight?: string|number}} opts
 */
export const makeEdgeStyle = ({ directed = true, category = DEFAULT_CATEGORY, weight } = {}) => {
  const color = EDGE_VARS[category] || EDGE_VARS[DEFAULT_CATEGORY];
  const edge = {
    animated: true,
    style: {
      stroke: color,
      strokeWidth: 1.5,
      strokeLinecap: 'round',
      opacity: 0.55,
    },
  };

  if (directed) {
    edge.markerEnd = { type: 'arrow', color, width: 14, height: 14 };
  }

  const hasWeight = weight !== undefined && weight !== null && weight !== '';
  if (hasWeight) {
    edge.weight = weight;
    edge.label = `${weight}`;
    edge.labelStyle = { fontWeight: 600, fontSize: 11, fontVariantNumeric: 'tabular-nums' };
    edge.labelBgStyle = {
      fill: 'rgba(18, 24, 38, 0.85)',
      stroke: 'rgba(255, 255, 255, 0.1)',
      strokeWidth: 1,
    };
    edge.labelBgPadding = [7, 4];
    edge.labelBgBorderRadius = 8;
    edge.labelBgStrokeWidth = 1;
  }

  return edge;
};
