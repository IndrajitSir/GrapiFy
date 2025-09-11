import 'reactflow/dist/style.css';
import Node from '../CustomNode/Node';
import { useUndirectedUnweighted } from '../../context/UndirectedUnweighted/UndirectedUnweightedContext';
import ReactFlow, { MiniMap, Controls, applyNodeChanges, //Background
} from 'reactflow';

const nodeTypes = {
  custom: Node,
};

const UndirectedUnweightedGraph = () => {
  const { nodes, setNodes, edges, setEdges, sourceNode, setSourceNode, targetNode, setTargetNode } = useUndirectedUnweighted();

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
      target: targetNode
    };
    setEdges((prevEdges) => [...prevEdges, newEdge]);
    setSourceNode('');
    setTargetNode('');
  }

  // Add child node
  const addChild = (parentId) => {
    // Generate unique ID for the new node
    const newNodeId = `${nodes.length + 1}`;
    const parentNode = nodes.find(node => node.id === parentId);

    // Position new node below parent
    const newNode = {
      id: newNodeId,
      type: 'custom',
      position: { x: parentNode.position.x + 40, y: parentNode.position.y + 100 },
      data: { label: `Node ${newNodeId}`, addChild },
    };

    // Add the new node and edge
    setNodes(prevNodes => [...prevNodes, newNode]);
    setEdges(prevEdges => [
      ...prevEdges,
      { id: `e${parentId}-${newNodeId}`, source: parentId, target: newNodeId, animated: true, markerEnd: { color: 'red' }, style: { stroke: 'red', strokeWidth: 2 } },
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
      <ReactFlow nodes={nodesWithAddAndRemoveChild} edges={edges} onNodesChange={handleNodesChange} onConnect={onConnect} nodeTypes={nodeTypes} >
        <MiniMap />
        {/* <Background color='black' Background='black' cursor='pointer' /> */}
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default UndirectedUnweightedGraph