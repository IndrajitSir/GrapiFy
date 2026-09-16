import { initialNodes, initialEdges } from '../../Constants/DirectedUnweighted'
import { DirectedUnweightedContext } from './DirectedUnweightedContext';
import { useState } from "react";
import { useNodesState, useEdgesState } from 'reactflow';

export const DirectedUnweightedGraphProvider = ({ children }) => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  // State for dropdown input
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');

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
    };
    setEdges((prevEdges) => [...prevEdges, newEdge]);
    setSourceNode('');
    setTargetNode('');
  }

  return (
    <>
      <DirectedUnweightedContext.Provider
        value={{ nodes, edges, setNodes, setEdges, sourceNode, setSourceNode, targetNode, setTargetNode, addEdge }}>
        {children}
      </DirectedUnweightedContext.Provider>
    </>
  )
}