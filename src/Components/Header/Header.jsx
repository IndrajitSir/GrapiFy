import './Header.css'
import { usePageContext } from '../../context/PageTracker/PageContext';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export const EdgeWeightInput = () => {
    const { ContextForWeighted } = usePageContext();
    const { handleUpdateWeight, handleWeightChange } = ContextForWeighted();

    return <>
        <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", padding: "10px" }}>
            <label>
                Edge Weight:
                <input
                    type="number"
                    onChange={handleWeightChange}
                    style={{ marginLeft: "10px" }}
                />
            </label>
            <button onClick={handleUpdateWeight} style={{ marginLeft: "10px" }}>
                Update
            </button>
        </div>
    </>
}

const Header = () => {
    const { activePage, Context } = usePageContext();
    const { nodes, setNodes, sourceNode, setSourceNode, targetNode, setTargetNode, setWeightInput, addEdge } = Context();
    const showWeightInput = (activePage === '/Undirected-Weighted-Graph' || activePage === '/Directed-Weighted-Graph') ? true : false;
    // const directed = (activePage === '/Directed-Unweighted-Graph' || activePage === '/Directed-Weighted-Graph') ? true : false;
    const [nodeName, setNodeName] = useState("");
    nodes.map(node => {
        console.log(`Node id: ${node.id}`);
    })
    const addNodeWithName = async (e) => {
        e.preventDefault();
        if (nodeName.trim() == '') {
            alert("Name caanot be Empty!");
        }
        const newNode = {
            id: `${nodes.length + 1}`,
            type: 'custom',
            position: {
                x: 150, y: 200
            },
            data: {
                label: `${nodeName}`,
            }
        }
        setNodes((prevNodes) => {
            [...prevNodes, newNode];
        })
    }

    return <>
        <div id='parent_container'>
            <div id='left_container'>
                <img src="/img3.jpg" alt="" style={{ height: '45px', width: '55px', mixBlendMode: 'color-burn', opacity: '0.8' }} />
                <h2>GrapiFy</h2>
            </div>
            <nav id='navbar_container'>
                <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "non-active-link")}>
                    Directed Unweighted Graph
                </NavLink>
                <NavLink to="/Directed-Weighted-Graph" className={({ isActive }) => (isActive ? "active-link" : "non-active-link")}>
                    Directed Weighted Graph
                </NavLink>
                <NavLink to="/Undirected-Unweighted-Graph" className={({ isActive }) => (isActive ? "active-link" : "non-active-link")}>
                    Undirected Unweighted Graph
                </NavLink>
                <NavLink to="/Undirected-Weighted-Graph" className={({ isActive }) => (isActive ? "active-link" : "non-active-link")}>
                    Undirected Weighted Graph
                </NavLink>
            </nav>
        </div>

        <div id='button_container'>
            <button id='addNodeButton' onClick={() => {
                document.querySelector('#adding_node_form').style.display = "block";
            }} type='button'>Add Node</button>
            <button id='addEdgeButton' onClick={() => {
                document.querySelector('#adding_edge_form').style.display = "block";
            }} type='button'>Add Edge</button>
        </div>
        <form style={{ display: 'none' }} id='adding_edge_form' onSubmit={addEdge}>
            <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0' }}>
                <label>
                    Source Node: {' '}
                    <select value={sourceNode} onChange={(e) => setSourceNode(e.target.value)}>
                        <option value="">Select source</option>
                        {nodes.map(node => (
                            <option key={node.id} value={node.id}>
                                {node.data.label || `Node ${node.id}`}
                            </option>
                        ))}
                    </select>
                </label><br />
                <label>
                    Target Node:{' '}
                    <select value={targetNode} onChange={(e) => setTargetNode(e.target.value)}>
                        <option value="">Select target</option>
                        {nodes.map(node => (
                            <option key={node.id} value={node.id}>
                                {node.data.label || `Node ${node.id}`}
                            </option>
                        ))}
                    </select>
                </label><br />
                {showWeightInput ? (
                    <label htmlFor="edge_weight">
                        Edge Weight:{' '}
                        <input type="number" name="edge_weight" id="edge_weight" onChange={(e) => setWeightInput(e.target.value)} />
                    </label>
                ) : null
                }
                <button type='submit' id='add' onClick={() => {
                    document.querySelector('#adding_edge_form').style.display = "none";
                }}>Add</button>
            </div>
        </form>
        <form id='adding_node_form' onSubmit={addNodeWithName}>
            <input type="text" name="node_name" id="node_name" placeholder='Node name' onChange={(e) => setNodeName(e.target.value)} />
            <button type='submit' id='add' onClick={() => {
                document.querySelector('#adding_node_form').style.display = "none";
            }}>Add</button>
        </form>
    </>
}
export default Header;