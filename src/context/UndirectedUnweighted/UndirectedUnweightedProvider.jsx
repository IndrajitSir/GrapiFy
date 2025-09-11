import { useState } from "react";
import { useNodesState, useEdgesState } from 'reactflow';
import {initialNodes, initialEdges} from '../../Constants/UndirectedUnweighted';
import { UndirectedUnweightedContext } from "./UndirectedUnweightedContext";

export const UndirectedUnweightedGraphProvider = ({ children }) => {
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);
    // State for dropdown input
    const [sourceNode, setSourceNode] = useState('');
    const [targetNode, setTargetNode] = useState('');
    return (
        <>
            <UndirectedUnweightedContext.Provider
                value={{ nodes, edges, setNodes, setEdges, sourceNode, setSourceNode, targetNode, setTargetNode }}>
                {children}
            </UndirectedUnweightedContext.Provider>
        </>
    )
}