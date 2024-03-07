import React, { useState } from "react";
import ReactFlow, { ReactFlowProvider, Background, Panel } from "reactflow";
import { shallow } from "zustand/shallow";
import { useStore } from "./store";
import { tw } from "twind";
import Osc from "./nodes/Osc";
import Amp from "./nodes/amp";
import Out from "./nodes/out";
// import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


import "reactflow/dist/style.css";

const nodeTypes = {
  osc: Osc,
  amp: Amp,
  out: Out,
};

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
      oscillatorData: [],
      amplifierData: [],
      // amplifierTypes: [],
      
    };
    const relation ={
      parentChildRelationship: [],
    };
    // Oscillator Data
    store.nodes
      .filter((node) => node.type === "osc")
      .forEach((node) => {
        values.oscillatorData.push({
          id: node.id,
          key: { frequency1: node.data.freq1, frequency2: node.data.freq2 },
          type: node.data.type,
        });
      });

    // Amplifier Data
    store.nodes
      .filter((node) => node.type === "amp")
      .forEach((node) => {
        values.amplifierData.push({
          id: node.id,
          key: { gain1: node.data.gain1, gain2: node.data.gain2 },
          type: node.data.type,
        });
        // logObject.amplifierTypes.push(node.data.type);
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
    const new_jsonData = {values, relation}
    const jsonData = JSON.stringify(new_jsonData, null, 2);

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
