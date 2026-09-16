import GraphCanvas from './GraphCanvas';
import { useDirectedUnweighted } from '../../context/DirectedUnweighted/DirectedUnweightedContext';

const DirectedUnweightedGraph = () => (
  <GraphCanvas useGraph={useDirectedUnweighted} directed weighted={false} />
);

export default DirectedUnweightedGraph;
