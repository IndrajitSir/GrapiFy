import GraphCanvas from './GraphCanvas';
import { useDirectedWeighted } from '../../context/DirectedWeighted/DirectedWeightedContext';

const DirectedWeightedGraph = () => (
  <GraphCanvas useGraph={useDirectedWeighted} directed weighted />
);

export default DirectedWeightedGraph;
