import { useEffect } from "react";
import { initialNodes, initialEdges } from '../../Constants/DirectedUnweighted';
import { useDirectedUnweighted } from "../../context/DirectedUnweighted/DirectedUnweightedContext";

function Home() {
  const { nodes } = useDirectedUnweighted();

  const tNodes = new Array();
  initialNodes.map((node) => {
    const nodeObject = new Object();
    nodeObject.id = node.id;
    nodeObject.label = node.data.label;
    nodeObject.data = ""
    tNodes.push(nodeObject);
  });

  useEffect(()=>{
    const edges = new Array();
    const prepareEdges = async () => {
      if (nodes[0].id !== undefined) {
        initialEdges.map((edge, index) => {
          const edgeObject = new Object();
          edgeObject.id = nodes[index].id;
          edgeObject.sourceNode = edge.source;
          edgeObject.targetNode = edge.target;
          edgeObject.directed = edge.markerEnd?.type === 'arrow' ? true : false;
          edges.push(edgeObject);
        });
      } else {
        console.log(`nodes id's are not present!`);
      }
    }
    prepareEdges();
  }, [nodes])

  return null
}
export default Home