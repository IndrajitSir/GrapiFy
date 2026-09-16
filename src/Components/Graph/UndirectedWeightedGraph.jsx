import GraphCanvas from './GraphCanvas';
import { useUndirectedWeighted } from '../../context/UndirectedWeighted/UndirectedWeightedContext';

const UndirectedWeightedGraph = () => (
  <GraphCanvas useGraph={useUndirectedWeighted} directed={false} weighted />
);

export default UndirectedWeightedGraph;
