import ReactFlow, {
  Handle,
} from 'reactflow';

import 'reactflow/dist/style.css';

// Custom Node Component
const Node = ({ id, data, style }) => {
  const { addChild, removeChild } = data;

  return (
    <div style={{ ...style, padding: '10px', border: '1px solid black', textAlign: 'center', cursor: 'pointer', borderRadius: '50%' }}>
      <div>{data.label}</div>
      {/* Plus button to add a child */}
      <button
        style={{
          marginTop: '10px',
          marginleft: '5px',
          padding: '0px 3px',
          fontSize: '14px',
          cursor: 'pointer',
          borderRadius: '50%',
        }}
        onClick={() => addChild(id)}
      >
        +
      </button>
      <button
        style={{
          marginTop: '10px',
          marginleft: '5px',
          padding: '0px 3px',
          fontSize: '14px',
          cursor: 'pointer',
          borderRadius: '50%',
        }}
        onClick={() => removeChild(id)}
      >
        -
      </button>
      <Handle type="source" position="bottom" />
      <Handle type="target" position="top" />
    </div>
  );
};
export default Node;