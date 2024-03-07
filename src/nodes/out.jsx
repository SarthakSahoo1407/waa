// import React from 'react';
// import { Handle } from 'reactflow';
// import { shallow } from 'zustand/shallow';
// import { useStore } from '../store';
// import { tw } from 'twind';

// const selector = (store) => ({
//   isRunning: store.isRunning,
//   toggleAudio: store.toggleAudio,
// });

// export default function Out({ id, data }) {
//   const { isRunning, toggleAudio } = useStore(selector, shallow);
//   // console.log('out', typeof(data));

//   return (
//     <div className={tw('rounded-md bg-white shadow-xl px-4 py-2')}>
//       <Handle className={tw('w-2 h-2')} type="target" position="top" />
//       {/* print data */
//       JSON.stringify(data)}
//       <button onClick={toggleAudio}>
//         {isRunning ? (
//           <span role="img" aria-label="mute">
//             🔈
//           </span>
//         ) : (
//           <span role="img" aria-label="unmute">
//             🔇
//           </span>

//         )}
//       </button>
//     </div>
//   );
// }


// // import React from 'react';
// // import { Handle } from 'reactflow';
// // import { useStore } from '../store';
// // import { tw } from 'twind';

// // const selector = (store) => ({
// //   nodes: store.nodes,
// //   edges: store.edges,
// // });

// // export default function Out({ id, data }) {
// //   const { nodes, edges } = useStore(selector);

// //   // Find the connected node with the given ID
// //   const connectedNode = edges.find((edge) => edge.target === id);
// //   let connectedNodeData = null;

// //   if (connectedNode) {
// //     connectedNodeData = nodes.find((node) => node.id === connectedNode.source)?.data;
// //   }

// //   return (
// //     <div className={tw('rounded-md bg-white shadow-xl px-4 py-2')}>
// //       <Handle className={tw('w-2 h-2')} type="target" position="top" />

// //       {/* Show connected node data in JSON format */}
// //       {connectedNodeData && (
// //         <pre>{JSON.stringify(connectedNodeData, null, 2)}</pre>
// //       )}

// //       <button onClick={toggleAudio}>
// //         {isRunning ? (
// //           <span role="img" aria-label="mute">
// //             🔈
// //           </span>
// //         ) : (
// //           <span role="img" aria-label="unmute">
// //             🔇
// //           </span>
// //         )}
// //       </button>
// //     </div>
// //   );
// // }


import React from 'react';
import { Handle } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { tw } from 'twind';

const selector = (store) => ({
  isRunning: store.isRunning,
  toggleAudio: store.toggleAudio,
  oscNodes: store.oscNodes, // New property to access values from Osc nodes
  ampNodes: store.ampNodes, // New property to access values from Amp nodes
});

export default function Out({ id, data }) {
  const { isRunning, toggleAudio, oscNodes, ampNodes } = useStore(selector, shallow);
  
  // Combine values from Osc and Amp nodes
  const allNodesData = { ...oscNodes, ...ampNodes };

  // Log combined values
  // console.log("All Nodes Data:", allNodesData);

  return (
    <div className={tw('rounded-md bg-white shadow-xl px-4 py-2')}>
      <Handle className={tw('w-2 h-2')} type="target" position="top" />

      {/* Render combined values from Osc and Amp nodes */}
      {/* <p>All Nodes Data: {JSON.stringify(allNodesData)}</p> */}

      {/* Toggle audio button */}
      <button onClick={toggleAudio}>
        {isRunning ? (
          <span role="img" aria-label="mute">
            🔈
          </span>
        ) : (
          <span role="img" aria-label="unmute">
            🔇
          </span>
        )}
      </button>
    </div>
  );
}
