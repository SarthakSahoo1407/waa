import React, { useState, useCallback } from "react";
import ReactFlow, { ReactFlowProvider, Background, Panel } from "reactflow";
import { shallow } from "zustand/shallow";
import { useStore } from "./store";
import { tw } from "twind";
import Osc from "./nodes/Osc";
import Amp from "./nodes/amp";
import Out from "./nodes/out";
import layers from "./layer.json"; // Import the layer.json file

import "reactflow/dist/style.css";
import { random } from "nanoid";

const nodeTypes = {
  osc: Osc,
  amp: Amp,
  out: Out,
};

const flowKey = "example-flow";

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onNodesDelete: store.onNodesDelete,
  onEdgesChange: store.onEdgesChange,
  onEdgesDelete: store.onEdgesDelete,
  addEdge: store.addEdge,
  addOsc: () => store.createNode("osc"),
  addAmp: () => store.createNode("amp"),
});

export default function App() {
  const store = useStore(selector, shallow);
  const [logData, setLogData] = useState({});

  const handleLogClick = () => {
    const values = {
      InputNode: [],
      HiddenNode: [],
    };
    const relation = {
      parentChildRelationship: [],
    };

    // Oscillator Data
    // store.nodes
    //   .filter((node) => node.type === "osc")
    //   .forEach((node) => {
    //     const InputNode = {
    //       id: node.id,
    //       args: {},
    //       kwargs: {},
    //       type: node.data.type,
    //     };

    //     // Assuming dynamic data is available in the 'data' object of each node
    //     for (const [key, value] of Object.entries(node.data)) {
    //       InputNode.key[key] = value;
    //     }

    //     values.InputNode.push(InputNode);
    //   });
    store.nodes
      .filter((node) => node.type === "osc")
      .forEach((node) => {
        const InputNode = {
          id: node.id,
          args: {}, // Initialize args object
          kwargs: { ...node.data }, // Initialize kwargs object with existing data
          type: node.data.type,
        };

        // Loop through each parameter object and add them to the kwargs object
        layers.forEach((layer) => {
          if (layer.Name === node.data.type) {
            const params = layer.params;

            // Loop through args
            params.args.forEach((arg) => {
              InputNode.kwargs[arg] = ""; // Initialize with empty string
            });

            // Loop through kwargs
            Object.entries(params.kwargs).forEach(([key, value]) => {
              InputNode.kwargs[key] = value; // Set default value
            });
          }
        });

        values.InputNode.push(InputNode);
      });

    // Amplifier Dat
    store.nodes
      .filter((node) => node.type === "amp")
      .forEach((node) => {
        const HiddenNode = {
          id: node.id,
          key: {},
          type: node.data.type,
        };

        // Assuming dynamic data is available in the 'data' object of each node
        for (const [key, value] of Object.entries(node.data)) {
          HiddenNode.key[key] = value;
        }

        values.HiddenNode.push(HiddenNode);
      });

    // Parent-Child Relationship
    const parentChildMap = {};
    store.edges.forEach((edge) => {
      const { source, target } = edge;
      if (!parentChildMap[source]) {
        parentChildMap[source] = [];
      }
      parentChildMap[source].push(target);
    });

    store.nodes.forEach((node) => {
      const children = parentChildMap[node.id] || [];
      children.forEach((childId) => {
        const parentName = node.id;
        const childName = childId;
        relation.parentChildRelationship.push({
          parent: parentName,
          child: childName,
        });
      });
    });

    console.log(values);
    console.log(relation);

    const jsonData = JSON.stringify({ values, relation }, null, 2);

    // Create a blob with the JSON data
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.download = "log_data.json";

    // Click the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  // Function to render input fields based on data from layer.json
  const renderInputFields = (nodeType) => {
    const layerParams = layers[nodeType];
    if (!layerParams) return null;

    const inputs = [];
    for (const [param, defaultValue] of Object.entries(layerParams)) {
      inputs.push(
        <label key={param} className={tw("flex flex-col px-2 py-1")}>
          <p className={tw("text-xs font-bold mb-2")}>{param}</p>
          <input
            className="nodrag block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            type="text"
            value={defaultValue}
            // Handle input change here if needed
          />
          {/* Display default value for now, handle input change if needed */}
          <p className={tw("text-right text-xs")}>{defaultValue}</p>
        </label>
      );
    }
    return inputs;
  };

  return (
    <ReactFlowProvider>
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={store.nodes}
          edges={store.edges}
          onNodesChange={store.onNodesChange}
          onNodesDelete={store.onNodesDelete}
          onEdgesChange={store.onEdgesChange}
          onEdgesDelete={store.onEdgesDelete}
          onConnect={store.addEdge}
          fitView
        >
          <Panel className={tw("space-x-4")} position="top-right">
            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.addOsc}
            >
              Input Node
            </button>
            <button
              className={tw("px-2 py-1 rounded bg-white shadow")}
              onClick={store.addAmp}
            >
              New Node
            </button>
            <button
              className={tw("px-2 py-1 mt-4 rounded bg-white shadow")}
              onClick={handleLogClick}
            >
              Log Data
            </button>
          </Panel>
          <Background />
        </ReactFlow>

        {/* Render input fields for each node */}
        {store.nodes.map((node) => (
          <div key={node.id}>{renderInputFields(node.type)}</div>
        ))}

        {/* Uncomment this section if you want to display the JSON data within the application */}
        {/* {logData && (
          <div>
            <h2>Logged Data:</h2>
            <pre>{JSON.stringify(logData, null, 2)}</pre>
          </div>
        )} */}
      </div>
    </ReactFlowProvider>
  );
}