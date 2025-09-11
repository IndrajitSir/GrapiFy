import 'reactflow/dist/style.css';
import Node from '../CustomNode/WeightedNode';
import { useUndirectedWeighted } from '../../context/UndirectedWeighted/UndirectedWeightedContext';
import ReactFlow, { MiniMap, Controls, applyNodeChanges, //Background
} from 'reactflow';

const nodeTypes = {
  custom: Node,
};

const UndirectedWeightedGraph = () => {
  const { nodes, setNodes, edges, setEdges, sourceNode, setSourceNode, targetNode, setTargetNode, weightInput, selectedEdge, handleEdgeClick, handleUpdateWeight, handleWeightChange } = useUndirectedWeighted();

  //Add Edge Between two nodes
  const addEdge = async (e) => {
    e.preventDefault();
    if (!sourceNode || !targetNode || sourceNode === targetNode) {
      alert("Please select valid source and target node!");
      return;
    }

    if (edges.some(edge => edge.source === sourceNode && edge.target === targetNode)) {
      alert("Edge Already Exist!");
      return;
    }
    const newEdge = {
      id: `e${sourceNode}-${targetNode}`,
      source: sourceNode,
      target: targetNode,
      weight: weightInput,
      label: `${weightInput}`
    };
    setEdges((prevEdges) => [...prevEdges, newEdge]);
    setSourceNode('');
    setTargetNode('');
  }

  // Add child node
  const addChild = (parentId, weightInput) => {
    // Generate unique ID for the new node
    const newNodeId = `${nodes.length + 1}`;
    const parentNode = nodes.find(node => node.id === parentId);

    // Position new node below parent
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: { x: parentNode.position.x + 100, y: parentNode.position.y + 200 },
      data: { label: `Node ${newNodeId}`, addChild, removeChild },
      weight: weightInput,
      label: `${weightInput}`
    };

    // Add the new node and edge
    setNodes(prevNodes => [...prevNodes, newNode]);
    setEdges(prevEdges => [
      ...prevEdges,
      { id: `e${parentId}-${newNodeId}`, source: parentId, target: newNodeId, animated: true, markerEnd: { type: 'arrow', color: 'red' }, style: { stroke: 'blue', strokeWidth: 2 } },
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

  const onConnect = (params) => {
    setEdges((edgs) => addEdge(params, edgs))
  }
  const handleNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', cursor: 'pointer' }}>
      <ReactFlow nodes={nodesWithAddAndRemoveChild} edges={edges} onNodesChange={handleNodesChange} onConnect={onConnect} nodeTypes={nodeTypes} onEdgeClick={handleEdgeClick} onEdgesChange={setEdges}>
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
export default UndirectedWeightedGraph