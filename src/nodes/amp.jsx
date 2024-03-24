// import React from 'react';
// import { Handle } from 'reactflow';
// import { shallow } from 'zustand/shallow';
// import { useStore } from '../store';
// import { tw } from 'twind';

// const selector = (id) => (store) => ({
//   setGain: (gain1, gain2, type) => store.updateNode(id, { gain1, gain2,type }),
// });

// export default function Amp({ id, data }) {
//   const { setGain } = useStore(selector(id), shallow);

//   // Check if data.gain1 and data.gain2 are undefined and provide default values if they are
//   const gain1 = data.gain1 !== undefined ? data.gain1 : '';
//   const gain2 = data.gain2 !== undefined ? data.gain2 : '';

//   // Log gain1 and gain2 in JSON format
//   // console.log(JSON.stringify({ gain1, gain2 }));

//   return (
//     <div className={tw('rounded-md bg-white shadow-xl px-4 py-2')}>
//       <Handle className={tw('w-2 h-2')} type="target" position="top" />

//       <p className={tw('rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm')}>Amp</p>
//       <label className={tw('flex flex-col px-2 pt-1 pb-2')}>
//         <p className={tw('text-xs font-bold mb-2')}>Gain 1</p>
//         <input
//           className="nodrag"
//           type="text"
//           min="0"
//           max="1"
//           step="0.01"
//           value={gain1}
//           onChange={(e) => setGain(+e.target.value, data.gain2)}
//         />
//         <p className={tw('text-right text-xs')}>{parseFloat(gain1).toFixed(2)}</p>
//       </label>
      
//       <label className={tw('flex flex-col px-2 pt-1 pb-2')}>
//         <p className={tw('text-xs font-bold mb-2')}>Gain 2</p>
//         <input
//           className="nodrag"
//           type="text"
//           min="0"
//           max="1"
//           step="0.01"
//           value={gain2}
//           onChange={(e) => setGain(data.gain1, +e.target.value)}
//         />
//         <p className={tw('text-right text-xs')}>{parseFloat(gain2).toFixed(2)}</p>
//       </label>

//       <label className={tw('flex flex-col px-2 pt-1 pb-2')}>
//         <p className={tw('text-xs font-bold mb-2')}>Waveform</p>
//         <select
//           className="nodrag"
//           value={data.type}
//           onChange={(e) => setGain(data.gain1, data.gain2, e.target.value)}
//         >
//           <option value="sine">sine</option>
//           <option value="triangle">triangle</option>
//           <option value="sawtooth">sawtooth</option>
//           <option value="square">square</option>
//         </select>
//       </label>

//       <Handle className={tw('w-2 h-2')} type="source" position="bottom" />
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Handle } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { tw } from 'twind';
import layers from '../layer.json';

const selector = (id) => (store) => ({
  setParameters: (params) => store.updateNode(id, params),  
});

export default function Amp({ id, data }) {
  const { setParameters } = useStore(selector(id), shallow);
  const [selectedLayer, setSelectedLayer] = useState(Object.keys(layers)[0]);


  const handleParamChange = (key, value) => {
    setParameters({ ...data, [key]: value });
  };

  const renderInputFields = () => {
    const layerParams = layers[selectedLayer];
    if (!layerParams || !layerParams.params) return null;
  
    const inputs = [];
    const { params } = layerParams;
  
    // Function to split the input fields into three columns
    const splitIntoThreeColumns = (array) => {
      const thirdIndex = Math.ceil(array.length / 3);
      const firstColumn = array.slice(0, thirdIndex);
      const secondColumn = array.slice(thirdIndex, thirdIndex * 2);
      const thirdColumn = array.slice(thirdIndex * 2);
      return [firstColumn, secondColumn, thirdColumn];
    };
  
    const inputFields = [];
  
    for (const [param, defaultValue] of Object.entries(params)) {
      let inputField;
  
      if (param === 'args') {
        for (const arg of defaultValue) {
          if(arg === '**kwargs') continue;
          inputField = (
            <div key={arg} className={tw('mb-2 w-full')}>
              <label className={tw('block text-sm font-bold mb-1')}>{arg}</label>
              <input
                className={tw('w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500')}
                type="text"
                value={data[arg] || ''}
                onChange={(e) => handleParamChange(arg, e.target.value)}
              />
            </div>
          );
          inputFields.push(inputField);
        }
      } 
      else if (typeof defaultValue === 'object') {
        // Handle rendering object properties individually
        for (const [key, val] of Object.entries(defaultValue)) {
          inputField = (
            <div key={key} className={tw('mb-2 w-full')}>
              <label className={tw('block text-sm font-bold mb-1')}>{key}</label>
              <input
                className={tw('w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500')}
                type="text"
                value={data[key] || val}
                onChange={(e) => handleParamChange(key, e.target.value)}
              />
            </div>
          );
          inputFields.push(inputField);
        }
      } else {
        inputField = (
          <div key={param} className={tw('mb-2 w-full')}>
            <label className={tw('block text-sm font-bold mb-1')}>{param}</label>
            <input
              className={tw('w-full px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500')}
              type="text"
              value={data[param] || defaultValue}
              onChange={(e) => handleParamChange(param, e.target.value)}
            />
          </div>
        );
        inputFields.push(inputField);
      }
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
      {/* Output handle */}
      <Handle
        type="source"
        position="bottom"
        id={`${id}_output`}
        style={{ background: '#555' }}
      />

      <p className={tw('rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm')}>Amp</p>
      <label className={tw('flex flex-col px-2 py-1')}>
        <p className={tw('text-xs font-bold mb-2')}>Layer Type</p>
        <select
          className="nodrag"
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
        >
          {Object.keys(layers).map((layer) => (
            <option key={layer} value={layer}>
              {layer}
            </option>
          ))}
        </select>
      </label>
      {renderInputFields()}

      {/* Input handle */}
      <Handle
        type="target"
        position="top"
        id={`${id}_input`}
        style={{ background: '#555' }}
      />
    </div>
  );
}
