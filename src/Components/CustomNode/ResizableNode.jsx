// import React, { useState } from 'react';
// import ReactFlow, { Handle, Background, Controls } from 'reactflow';
// import { ResizableBox } from 'react-resizable';
// import 'reactflow/dist/style.css';
// import 'react-resizable/css/styles.css';

// const ResizableNode = ({ data, id }) => {
//   const [width, setWidth] = useState(150);
//   const [height, setHeight] = useState(100);

//   const handleResize = (e, { size }) => {
//     setWidth(size.width);
//     setHeight(size.height);
//   };

//   return (
//     <ResizableBox
//       width={width}
//       height={height}
//       onResize={handleResize}
//       resizeHandles={['se']} // South-East (bottom-right corner)
//       minConstraints={[100, 50]} // Minimum size
//       maxConstraints={[300, 200]} // Maximum size
//       style={{ border: '1px solid #ddd', background: '#f5f5f5' }}
//     >
//       <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         {data.label}
//       </div>
//       <Handle type="target" position="left" />
//       <Handle type="source" position="right" />
//     </ResizableBox>
//   );
// };

// export default ResizableNode;

import React, { useState } from 'react';
import { Handle } from 'reactflow';

const ResizableNode = ({ data }) => {
  const [dimensions, setDimensions] = useState({ width: 150, height: 100 });
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (event) => {
    event.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (event) => {
    if (isResizing) {
      setDimensions((prev) => ({
        width: Math.max(100, prev.width + event.movementX), // Minimum width
        height: Math.max(50, prev.height + event.movementY), // Minimum height
      }));
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [ isResizing]);

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        border: '1px solid #ccc',
        background: '#f5f5f5',
        position: 'relative',
        cursor: isResizing ? 'nwse-resize' : 'default',
        borderRadius: '50%'
      }}
    >
      <div style={{ textAlign: 'center' }}>{data.label}</div>
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
      {/* Resize Handle */}
      <div
        style={{
          width: 10,
          height: 10,
          background: 'blue',
          position: 'absolute',
          bottom: 0,
          right: 0,
          cursor: 'nwse-resize',
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ResizableNode;