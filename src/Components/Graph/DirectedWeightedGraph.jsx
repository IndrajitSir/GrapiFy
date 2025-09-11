import 'reactflow/dist/style.css';
import Node from '../CustomNode/WeightedNode';
import { useDirectedWeighted } from '../../context/DirectedWeighted/DirectedWeightedContext';
import ReactFlow, { MiniMap, Controls, applyNodeChanges, //Background
} from 'reactflow';

const nodeTypes = {
  custom: Node,
};

const DirectedWeightedGraph = () => {
  const { nodes, setNodes, edges, setEdges, selectedEdge, weightInput, handleEdgeClick, handleWeightChange, handleUpdateWeight } = useDirectedWeighted();

  // Add child node
  const addChild = (parentId, weight) => {
    // Generate unique ID for the new node
    const newNodeId = `${nodes.length + 1}`;
    const parentNode = nodes.find(node => node.id === parentId);

    // Position new node below parent
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: { x: parentNode.position.x + 40, y: parentNode.position.y + 100 },
      data: { label: `Node ${newNodeId}`, addChild, removeChild },
    };

    // Add the new node and edge
    setNodes(prevNodes => [...prevNodes, newNode]);
    setEdges(prevEdges => [
      ...prevEdges,
      { id: `e${parentId}-${newNodeId}`, source: parentId, target: newNodeId, animated: true, markerEnd: { type: 'arrow', color: 'red' }, style: { stroke: 'red', strokeWidth: 2 }, weight: weight, label: `${weight}` },
    ]);
  };

  const removeChild = (nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  // Pass the addChild and removeChild function to the nodes
  const nodesWithAddAndRemoveChild = nodes.map(node => ({
    ...node,
    data: { ...node.data, addChild, removeChild },
  }));

  // const onConnect = (params) => {
  //   setEdges((edgs) => addEdge(params, edgs))
  // }
  const handleNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', cursor: 'pointer' }}>
      <ReactFlow nodes={nodesWithAddAndRemoveChild} edges={edges} onNodesChange={handleNodesChange} nodeTypes={nodeTypes} onEdgeClick={handleEdgeClick} onEdgesChange={setEdges}>
        <MiniMap />
        {/* <Background color='black' Background='black' cursor='pointer' /> */}
        <Controls />
      </ReactFlow>
      {
        selectedEdge && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", padding: "10px" }}>
            <label>
              Edge Weight:
              <input
                type="number"
                value={weightInput}
                onChange={handleWeightChange}
                style={{ marginLeft: "10px" }}
              />
            </label>
            <button onClick={handleUpdateWeight} style={{ marginLeft: "10px" }}>
              Update
            </button>
          </div>
        )
      }
    </div>
  );
};
export default DirectedWeightedGraph