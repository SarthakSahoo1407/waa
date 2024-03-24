// import React from 'react';
// import { Handle } from 'reactflow';
// import { shallow } from 'zustand/shallow';
// import { tw } from 'twind';
// import { useStore } from '../store';

// const selector = (id) => (store) => ({
//   setParameters: (freq1, freq2, type) => store.updateOscNode(id, freq1, freq2, type),
// });

// export default function Osc({ id, data }) {
//   const { setParameters } = useStore(selector(id), shallow);

//   // Check if data.freq1 and data.freq2 are undefined and provide default values if they are
//   const freq1 = data.freq1 !== undefined ? data.freq1 : '';
//   const freq2 = data.freq2 !== undefined ? data.freq2 : '';

//   // console.log(JSON.stringify({ freq1, freq2, type: data.type }));
//   return (
//     <div className={tw('rounded-md bg-white shadow-xl')}>
//       <p className={tw('rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm')}>Osc</p>

//       <label className={tw('flex flex-col px-2 py-1')}>
//         <p className={tw('text-xs font-bold mb-2')}>Frequency 1</p>
//         <input
//           className="nodrag block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//           type="text"
//           value={freq1}
//           onChange={(e) => setParameters(+e.target.value, freq2, data.type)}
//         />
//         <p className={tw('text-right text-xs')}>{freq1}</p>
//       </label>

//       <label className={tw('flex flex-col px-2 py-1')}>
//         <p className={tw('text-xs font-bold mb-2')}>Frequency 2</p>
//         <input
//           className="nodrag block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//           type="text"
//           value={freq2}
//           onChange={(e) => setParameters(freq1, +e.target.value, data.type)}
//         />
//         <p className={tw('text-right text-xs')}>{freq2}</p>
//       </label>

//       <label className={tw('flex flex-col px-2 pt-1 pb-4')}>
//         <p className={tw('text-xs font-bold mb-2')}>Waveform</p>
//         <select
//           className="nodrag"
//           value={data.type}
//           onChange={(e) => setParameters(freq1, freq2, e.target.value)}
//         >
//           <option value="sine">sine</option>
//           <option value="triangle">triangle</option>
//           <option value="sawtooth">sawtooth</option>
//           <option value="square">square</option>
//           {/* take the option value form datas.json */}

//         </select>
//       </label>

//       <Handle className={tw('w-2 h-2')} type="source" position="bottom" />
//     </div>
//   );
// }



import React, { useState } from 'react';
import { Handle } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { tw } from 'twind';
import { useStore } from '../store';
import layers from '../layer.json';

const selector = (id) => (store) => ({
  setParameters: (params) => store.updateNode(id, params),
});

export default function Osc({ id, data }) {
  const { setParameters } = useStore(selector(id), shallow);
  const [selectedLayer, setSelectedLayer] = useState(Object.keys(layers)[0]);

  const handleParamChange = (key, value) => {
    setParameters({ ...data, [key]: value });
  };

  // Inside the renderInputFields function

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
      <p className={tw('rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm')}>Osc</p>
      <label className={tw('flex flex-col px-2 py-1')}>
        <p className={tw('text-xs font-bold mb-2')}>Layer Type</p>
        <select
          className="nodrag"
          value={selectedLayer}
          onChange={(e) => setSelectedLayer(e.target.value)}
        >
          {/* {Object.keys(layers).map((layer) => (
            // console.log()
            <option key={layer} value={layer}>
              {layer}
            </option>
          ))} */}

          {/* itereate the layer names that are the keys of "Name" */}
          {Object.keys(layers).map((layer) => (
            <option key={layer} value={layer}>
              {layers[layer].Name}
            </option>
          ))}
        </select>
      </label>
      {renderInputFields()}
      <Handle className={tw('w-2 h-2')} type="source" position="bottom" />
    </div>
  );
}
