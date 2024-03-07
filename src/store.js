import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
// import { create } from 'zustand';
// import { updateAudioNode } from './audio';
// import { nanoid } from 'nanoid';
// /
// export const useStore = create((set, get) => ({

import {
  isRunning,
  toggleAudio,
  createAudioNode,
//   updateAudioNode,
  removeAudioNode,
  connect,
  disconnect,
} from './audio';

export const useStore = create((set, get) => ({
  nodes: [{ id: 'output', type: 'out', position: { x: 0, y: 0 } }],
  edges: [],
  isRunning: isRunning(),

  oscNodes: {}, // New property to store values from osc nodes
  ampNodes: {}, //
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

  updateNode(id, newData) {
    const updatedNodes = get().nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...newData
          }
        };
      }
      return node;
    });

    set({ nodes: updatedNodes });
  },

  // Function to update parameters for Osc nodes
  updateOscNode(id, freq1, freq2, type) {
    const updatedNodes = get().nodes.map((node) => {
      if (node.id === id && node.type === 'osc') {
        return {
          ...node,
          data: {
            ...node.data,
            freq1,
            freq2,
            type
          }
        };
      }
      return node;
    });

    set({ nodes: updatedNodes });
  },


  
  // Function to update parameters for Amp nodes
  // updateAmpNode(id, gain1, gain2) {
  //   const updatedNodes = get().nodes.map((node) => {
  //     if (node.id === id && node.type === 'amp') {
  //       return {
  //         ...node,
  //         data: {
  //           ...node.data,
  //           gain1,
  //           gain2
  //         }
  //       };
  //     }
  //     return node;
  //   });

  //   set({ nodes: updatedNodes });
  // },

  updateAmpNode(id, gain1, gain2, type) {
    const updatedNodes = get().nodes.map((node) => {
      if (node.id === id && node.type === 'amp') {
        return {
          ...node,
          data: {
            ...node.data,
            gain1,
            gain2,
            type
          }
        };
      }
      return node;
    });
  
    set({ nodes: updatedNodes });
  },
  

updateOutNode() {
  const { oscNodes, ampNodes } = get();
  const outNodeData = { ...oscNodes, ...ampNodes };
  const updatedNodes = get().nodes.map(node => {
    if (node.id === 'output') {
      return {
        ...node,
        data: outNodeData
      };
    }
    return node;
  });
  set({ nodes: updatedNodes });
}
,

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
  onNodesDelete(deleted) {
    const updatedNodes = get().nodes.filter(node => !deleted.some(({ id }) => id === node.id));
    set({ nodes: updatedNodes });
  
    for (const { id } of deleted) {
      removeAudioNode(id);
    }
  },
  
  onEdgesDelete(deleted) {
    const updatedEdges = get().edges.filter(edge => !deleted.some(({ id }) => id === edge.id));
    set({ edges: updatedEdges });
  
    for (const { source, target } of deleted) {
      disconnect(source, target);
    }
  },
  deriveParentChildrenRelation() {
    const { nodes, edges } = get();
    const nodeMap = {};

    // Initialize nodeMap with empty children arrays for each node
    nodes.forEach(node => {
      nodeMap[node.id] = { ...node, children: [] };
    });

    // Populate children arrays based on edges
    edges.forEach(edge => {
      const { source, target } = edge;
      if (nodeMap[source] && nodeMap[target]) {
        nodeMap[source].children.push(target);
      }
    });

    // Find root nodes (nodes without parents)
    const rootNodes = Object.values(nodeMap).filter(node => !edges.some(edge => edge.target === node.id));

    // Convert parent-children relationship to JSON format
    const jsonOutput = rootNodes.map(rootNode => {
      const convertToJSON = node => ({
        id: node.id,
        children: node.children.map(childId => convertToJSON(nodeMap[childId]))
      });

      return convertToJSON(rootNode);
    });
    console.log(jsonOutput);
    return jsonOutput;
  },
  

  
}));
