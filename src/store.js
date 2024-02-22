import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import {
    isRunning,
    toggleAudio,
    createAudioNode,
    updateAudioNode,
    removeAudioNode,
    connect,
    disconnect,
} from './audio';

export const useStore = create((set, get) => ({
    nodes: [{ id: 'output', type: 'out', position: { x: 0, y: 0 } }],
    edges: [],
    isRunning: isRunning(),

    toggleAudio() {
        toggleAudio().then(() => {
            set({ isRunning: isRunning() });
        });
    },

    onNodesChange(changes) {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },

    createNode(type, x, y) {
        const id = nanoid();

        switch (type) {
            case 'osc': {
                const data = { frequency: 440, type: 'sine' };
                const position = { x: 0, y: 0 };

                createAudioNode(id, type, data);
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }

            case 'amp': {
                const data = { gain: 0.5 };
                const position = { x: 0, y: 0 };

                createAudioNode(id, type, data);
                set({ nodes: [...get().nodes, { id, type, data, position }] });

                break;
            }
        }
    },

    updateNode(id, data) {
        updateAudioNode(id, data);
        set({
            nodes: get().nodes.map((node) =>
                node.id === id ? { ...node, data: Object.assign(node.data, data) } : node
            ),
        });
    },

    onNodesDelete(deleted) {
        for (const { id } of deleted) {
            removeAudioNode(id);
        }
    },

    onEdgesChange(changes) {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    addEdge(data) {
        const id = nanoid(6);
        const edge = { id, ...data };

        connect(edge.source, edge.target);
        set({ edges: [edge, ...get().edges] });
    },

    onEdgesDelete(deleted) {
        for ({ source, target } of deleted) {
            disconnect(source, target);
        }
    },
}));






// // import React from 'react';
// import { Handle } from "reactflow";
// import { shallow } from "zustand/shallow";
// import { tw } from "twind";
// import { useStore } from "../store";

// const selector = (id) => (store) => ({
//   setFrequency: (e) => store.updateNode(id, { frequency: +e.target.value }),
//   setType: (e) => store.updateNode(id, { type: e.target.value }),
// });

// export default function Osc({ id, data }) {
//   const { setFrequency, setType } = useStore(selector(id), shallow);

//   return (
//     <div className={tw("rounded-md bg-white shadow-xl")}>
//       <p
//         className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
//       >
//         Nodes
//       </p>

//       <label className={tw("flex flex-col px-2 py-1")}>
//         <p className={tw("text-xs text-black font-bold mb-2 p-")}>Parameter</p>
//         <input
//           className="text-xs text-white font-bold mb-2 p-"
//           // c
//           type="text"
//         />
//         {/* <p className={tw('text-right text-black text-xs')}>{data.frequency} Hz</p> */}
//       </label>

//       <hr className={tw("border-gray-200 mx-2")} />

//       <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
//         <p className={tw("text-xs  text-black font-bold mb-2")}>Waveform</p>
//         <select className="nodrag" onChange={setType}>
//           <option value="linear">Linear</option>
//           <option value="reLu">ReLu</option>
//           <option value="conv">Conv</option>
//           <option value="softmax">Softmax</option>
//         </select>
//       </label>

//       <Handle className={tw("w-2 h-2")} type="source" position="bottom" />
//     </div>
//   );
// }
