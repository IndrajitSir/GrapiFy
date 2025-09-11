import { useState } from "react";
import { useNodesState, useEdgesState } from 'reactflow';
import { initialNodes, initialEdges } from '../../Constants/UndirectedWeighted';
import { UndirectedWeightedContext } from "./UndirectedWeightedContext";

export const UndirectedWeightedGraphProvider = ({ children }) => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [weightInput, setWeightInput] = useState("");
  const [selectedEdge, setSelectedEdge] = useState(null);
  // State for dropdown input
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');

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
  return (
    <>
      <UndirectedWeightedContext.Provider
        value={{ nodes, edges, setNodes, setEdges, sourceNode, setSourceNode, targetNode, setTargetNode, selectedEdge, setSelectedEdge, weightInput, setWeightInput, handleEdgeClick, handleUpdateWeight, handleWeightChange }}>
        {children}
      </UndirectedWeightedContext.Provider>
    </>
  )
}