import React from "react";
import { useStore } from "./store";

const UniversalButton = () => {
  const logNodeData = () => {
    const { nodes, oscNodes, ampNodes } = useStore.getState();

    const logOscData = () => {
      Object.entries(oscNodes).forEach(([id, data]) => {
        // Retrieve selected layer information from your layer.json or store
        const selectedLayer = data.selectedLayer; // Replace with your logic
        const layerConfig = layers.find(
          (layer) => layer.Name === selectedLayer
        );

        if (layerConfig) {
          const logData = {
            Name: layerConfig.Name,
            params: {
              args: {},
              kwargs: {},
            },
          };

          // Populate logData.params based on data and layer.json
        }
      });
    };

    const logAmpData = () => {
      // Similar to logOscData but tailored for Amp nodes and your layer.json
    };

    logOscData();
    logAmpData();
  };

  return <button onClick={logNodeData}>Log Node Data</button>;
};

export default UniversalButton;
