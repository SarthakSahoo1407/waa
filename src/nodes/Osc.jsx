import React from 'react';
import { Handle } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { tw } from 'twind';
import { useStore } from '../store';

const selector = (id) => (store) => ({
  setParameters: (freq1, freq2, type) => store.updateOscNode(id, freq1, freq2, type),
});

export default function Osc({ id, data }) {
  const { setParameters } = useStore(selector(id), shallow);

  // Check if data.freq1 and data.freq2 are undefined and provide default values if they are
  const freq1 = data.freq1 !== undefined ? data.freq1 : '';
  const freq2 = data.freq2 !== undefined ? data.freq2 : '';

  // console.log(JSON.stringify({ freq1, freq2, type: data.type }));
  return (
    <div className={tw('rounded-md bg-white shadow-xl')}>
      <p className={tw('rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm')}>Osc</p>

      <label className={tw('flex flex-col px-2 py-1')}>
        <p className={tw('text-xs font-bold mb-2')}>Frequency 1</p>
        <input
          className="nodrag block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          type="text"
          value={freq1}
          onChange={(e) => setParameters(+e.target.value, freq2, data.type)}
        />
        <p className={tw('text-right text-xs')}>{freq1}</p>
      </label>

      <label className={tw('flex flex-col px-2 py-1')}>
        <p className={tw('text-xs font-bold mb-2')}>Frequency 2</p>
        <input
          className="nodrag block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          type="text"
          value={freq2}
          onChange={(e) => setParameters(freq1, +e.target.value, data.type)}
        />
        <p className={tw('text-right text-xs')}>{freq2}</p>
      </label>

      <label className={tw('flex flex-col px-2 pt-1 pb-4')}>
        <p className={tw('text-xs font-bold mb-2')}>Waveform</p>
        <select
          className="nodrag"
          value={data.type}
          onChange={(e) => setParameters(freq1, freq2, e.target.value)}
        >
          <option value="sine">sine</option>
          <option value="triangle">triangle</option>
          <option value="sawtooth">sawtooth</option>
          <option value="square">square</option>
          {/* take the option value form datas.json */}

        </select>
      </label>

      <Handle className={tw('w-2 h-2')} type="source" position="bottom" />
    </div>
  );
}


