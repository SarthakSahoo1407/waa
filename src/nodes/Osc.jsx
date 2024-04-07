//   import React, { useState } from 'react';
//   import { Handle } from 'reactflow';
//   import { shallow } from 'zustand/shallow';
//   import UniversalButton from "../Universal";

//   import { tw } from 'twind';
//   import { useStore } from '../store';
//   import layers from '../layer.json';

//   const selector = (id) => (store) => ({
//     setParameters: (params) => store.updateNode(id, params),
//     nodes: store.nodes,
//   });

//   export default function Osc({ id, data, nameField}) {
//     const { setParameters } = useStore(selector(id), shallow);
//     const [selectedLayer, setSelectedLayer] = useState(Object.keys(layers)[0]);
//     var l = layers[selectedLayer].Name;

//     // const handleParamChange = (key, value) => {
//     //   setParameters({ ...data, [key]: value });
//     // };
//     const [isUpdated, setIsUpdated] = useState(false);

// const handleParamChange = (key, value) => {
//   // Check if the node has already been updated
//   if (isUpdated) return;

//   // Update parameters except for the 'Name' field
//   if (key !== 'Name') {
//     setParameters({ ...data, [key]: value });
//   }
  
//   // Update l to reflect the latest Name field value
//   const updatedName = key === 'Name' ? value : layers[selectedLayer].Name;
//   l = updatedName;

//   // Update all input fields with values from the selected layer
//   const updatedArgs = { ...data };
//   const layerParams = layers[selectedLayer].params;
//   const args = layerParams.args;
//   const kwargs = layerParams.kwargs;

//   // Update args
//   for (const arg of Object.keys(args)) {
//     if (arg !== key) {
//       updatedArgs[arg] = args[arg];
//     }
//   }

//   // Update kwargs
//   for (const [kwarg, defaultValue] of Object.entries(kwargs)) {
//     if (kwarg !== key) {
//       updatedArgs[kwarg] = defaultValue;
//     }
//   }

//   setParameters(updatedArgs);

//   // Set the node as updated
//   setIsUpdated(true);
// };

    

//   const renderInputFields = () => {
//     const layerParams = layers[selectedLayer];
//     if (!layerParams || !layerParams.params) return null;

//     const inputs = [];
//     const { args, kwargs } = layerParams.params;

//     // Function to split the input fields into three columns
//     const splitIntoThreeColumns = (array) => {
//       const thirdIndex = Math.ceil(array.length / 3);
//       const firstColumn = array.slice(0, thirdIndex);
//       const secondColumn = array.slice(thirdIndex, thirdIndex * 2);
//       const thirdColumn = array.slice(thirdIndex * 2);
//       return [firstColumn, secondColumn, thirdColumn];
//     };

  
//     const inputFields = [];
//     for (const arg of Object.keys(args)) {
//       if (arg === '**kwargs') continue;
//       const defaultValue = args[arg];

//       const inputField = (
//         <div key={arg} className={tw('mb-2 w-full')}>
//           <label className={tw('block text-sm font-bold mb-1')}>{arg}</label>
//           <input
//             className={tw('w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500')}
//             type="text"
//             value={data[arg] || ''}
//             onChange={(e) => handleParamChange(arg, e.target.value)}
//           />
//         </div>
//       );
//       inputFields.push(inputField);
//     }

//     // Render input fields for kwargs
//     for (const [key, defaultValue] of Object.entries(kwargs)) {
//       const inputField = (
//         <div key={key} className={tw('mb-2 w-full')}>
//           <label className={tw('block text-sm font-bold mb-1')}>{key}</label>
//           <input
//             className={tw('w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500')}
//             type="text"
//             value={data[key] || defaultValue}
//             onChange={(e) => handleParamChange(key, e.target.value)}
//           />
//         </div>
//       );
//       inputFields.push(inputField);
//     }

//     const [firstColumn, secondColumn, thirdColumn] = splitIntoThreeColumns(inputFields);

//     return (
//       <div className={tw('grid grid-cols-3 gap-4')}>
//         <div>{firstColumn}</div>
//         <div>{secondColumn}</div>
//         <div>{thirdColumn}</div>
//       </div>
//     );
//   };


//     return (
//       <div className={tw('rounded-md bg-white shadow-xl')}>
//         <p className={tw('rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm')}>Osc</p>
//         <label className={tw('flex flex-col px-2 py-1')}>
//           <p className={tw('text-xs font-bold mb-2')}>Layer Type</p>
//           <select
//             className="nodrag"
//             value={selectedLayer}
//             onChange={(e) => setSelectedLayer(e.target.value)}
//           >
//             {/* {Object.keys(layers).map((layer) => (
//               // console.log()
//               <option key={layer} value={layer}>
//                 {layer}
//               </option>
//             ))} */}

//             {/* itereate the layer names that are the keys of "Name" */}
//             {Object.keys(layers).map((layer) => (
//               <option key={layer} value={layer}>
//                 {layers[layer].Name}
//               </option>
//             ))}
//           </select>
//         </label>
//         {renderInputFields()}
//         {/* <UniversalButton onClick={handleLogInputFields} /> Add the UniversalButton component */}

//         <Handle className={tw('w-2 h-2')} type="source" position="bottom" />
//       </div>
//     );
//   }

import React, { useState, useEffect } from 'react';
import { Handle } from 'reactflow';
import { shallow } from 'zustand/shallow';
import UniversalButton from "../Universal";

import { tw } from 'twind';
import { useStore } from '../store';
import layers from '../layer.json';

const selector = (id) => (store) => ({
  setParameters: (params) => store.updateNode(id, params),
  nodes: store.nodes,
});

export default function Osc({ id, data, nameField }) {
  const { setParameters } = useStore(selector(id), shallow);
  const [selectedLayer, setSelectedLayer] = useState(Object.keys(layers)[0]);
  const [inputData, setInputData] = useState(data);

  useEffect(() => {
    // Update input data when selectedLayer changes
    setInputData({ ...layers[selectedLayer].params.args, ...layers[selectedLayer].params.kwargs });
  }, [selectedLayer]);


  const handleParamChange = (key, value) => {
    // Update parameters except for the 'Name' field
    // const updatedParams = { ...data, [key]: value };
    // setParameters(updatedParams);
    const updatedData = { ...inputData, [key]: value };
    setInputData(updatedData);
    setParameters(updatedData);

  };


  const renderInputFields = () => {
    const layerParams = layers[selectedLayer];
    if (!layerParams || !layerParams.params) return null;
  
    const inputs = [];
    const { args, kwargs } = layerParams.params;
  
    // Function to split the input fields into three columns
    const splitIntoThreeColumns = (array) => {
      const thirdIndex = Math.ceil(array.length / 3);
      const firstColumn = array.slice(0, thirdIndex);
      const secondColumn = array.slice(thirdIndex, thirdIndex * 2);
      const thirdColumn = array.slice(thirdIndex * 2);
      return [firstColumn, secondColumn, thirdColumn];
    };
  
    const inputFields = [];
  
    // Render input fields for args
    for (const arg of Object.keys(args)) {
      if (arg === '**kwargs') continue;
      const defaultValue = args[arg];
  
      const inputField = (
        <div key={arg} className={tw('mb-2 w-full')}>
          <label className={tw('block text-sm font-bold mb-1')}>{arg}</label>
          {arg === 'Name' ? (
            <div className={tw('w-full px-2 py-1 rounded border border-gray-300 bg-gray-100')}>
              {data[arg] || ''}
            </div>
          ) : (
            <input
              className={tw('w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500')}
              type="text"
              value={data[arg] || ''}
              onChange={(e) => handleParamChange(arg, e.target.value)}
            />
          )}
        </div>
      );
      inputFields.push(inputField);
    }
  
    for (const [key, defaultValue] of Object.entries(kwargs)) {

      const inputField = (
        <div key={key} className={tw('mb-2 w-full')}>
          <label className={tw('block text-sm font-bold mb-1')}>{key}</label>
          <input
            className={tw('w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500')}
            type="text"
            value={data[key] || defaultValue}
            onChange={(e) => handleParamChange(key, e.target.value)}
          />
        </div>
      );
      inputFields.push(inputField);
    }
  
    const [firstColumn, secondColumn, thirdColumn] = splitIntoThreeColumns(inputFields);
  
    return (
      <div className={tw('grid grid-cols-3 gap-4')}>
        <div>{firstColumn}</div>
        <div>{secondColumn}</div>
        <div>{thirdColumn}</div>
      </div>
    );
  };
  
  return (
    <div className={tw('rounded-md bg-white shadow-xl')}>
      <p className={tw('rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm')}>Osc</p>
      <label className={tw('flex flex-col px-2 py-1')}>
        <p className={tw('text-xs font-bold mb-2')}>Layer Type</p>
        <select
          className="nodrag"
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
        >
          {Object.keys(layers).map((layer) => (
            <option key={layer} value={layer}>
              {layers[layer].Name}
            </option>
          ))}
        </select>
      </label>
      {renderInputFields()}
      {/* <UniversalButton /> */}
      <Handle className={tw('w-2 h-2')} type="source" position="bottom" />
    </div>
  );
}
