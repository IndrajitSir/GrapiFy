import { DirectedWeightedContext } from "./DirectedWeightedContext";
import {initialNodes, initialEdges} from '../../Constants/DirectedWeighted';
import { useState } from "react";
import { useNodesState, useEdgesState } from 'reactflow';

export const DirectedWeightedGraphProvider = ({ children }) => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  // State for dropdown input
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');

  const [weightInput, setWeightInput] = useState("");
  const [selectedEdge, setSelectedEdge] = useState(null);
  const handleEdgeClick = (event, edge) => {
    setSelectedEdge(edge.id);
    setWeightInput(edge.weight || "");
  }
  const handleWeightChange = (e) => {
    setWeightInput(e.target.value);
  }
  const handleUpdateWeight = () => {
    setEdges((prevEdges) => prevEdges.map((edge) => edge.id === selectedEdge ? { ...edge, weight: weightInput, label: weightInput } : edge));
    setSelectedEdge(null);
    setWeightInput("");
  }
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
      // animated: true, 
      // markerEnd: { type: 'arrow', color: 'red' }, 
      // style: { stroke: 'blue', strokeWidth: 2 }, 
      weight: weightInput,
      label: `${weightInput}`
    };
    setEdges((prevEdges) => [...prevEdges, newEdge]);
    setSourceNode('');
    setTargetNode('');
  }
  return (
    <>
      <DirectedWeightedContext.Provider
        value={{ nodes, edges, setNodes, setEdges, sourceNode, setSourceNode, targetNode, setTargetNode, selectedEdge, setSelectedEdge, weightInput, setWeightInput, handleEdgeClick, handleUpdateWeight, handleWeightChange, addEdge }}>
        {children}
      </DirectedWeightedContext.Provider>
    </>
  )
}