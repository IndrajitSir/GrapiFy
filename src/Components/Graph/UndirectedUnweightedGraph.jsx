import GraphCanvas from './GraphCanvas';
import { useUndirectedUnweighted } from '../../context/UndirectedUnweighted/UndirectedUnweightedContext';

const UndirectedUnweightedGraph = () => (
  <GraphCanvas useGraph={useUndirectedUnweighted} directed={false} weighted={false} />
);

export default UndirectedUnweightedGraph;
