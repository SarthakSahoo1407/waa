import React from 'react';
import { Handle } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { tw } from 'twind';

const selector = (id) => (store) => ({
  setGain: (gain1, gain2, type) => store.updateNode(id, { gain1, gain2,type }),
});

export default function Amp({ id, data }) {
  const { setGain } = useStore(selector(id), shallow);

  // Check if data.gain1 and data.gain2 are undefined and provide default values if they are
  const gain1 = data.gain1 !== undefined ? data.gain1 : '';
  const gain2 = data.gain2 !== undefined ? data.gain2 : '';

  // Log gain1 and gain2 in JSON format
  // console.log(JSON.stringify({ gain1, gain2 }));

  return (
    <div className={tw('rounded-md bg-white shadow-xl px-4 py-2')}>
      <Handle className={tw('w-2 h-2')} type="target" position="top" />

      <p className={tw('rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm')}>Amp</p>
      <label className={tw('flex flex-col px-2 pt-1 pb-2')}>
        <p className={tw('text-xs font-bold mb-2')}>Gain 1</p>
        <input
          className="nodrag"
          type="text"
          min="0"
          max="1"
          step="0.01"
          value={gain1}
          onChange={(e) => setGain(+e.target.value, data.gain2)}
        />
        <p className={tw('text-right text-xs')}>{parseFloat(gain1).toFixed(2)}</p>
      </label>
      
      <label className={tw('flex flex-col px-2 pt-1 pb-2')}>
        <p className={tw('text-xs font-bold mb-2')}>Gain 2</p>
        <input
          className="nodrag"
          type="text"
          min="0"
          max="1"
          step="0.01"
          value={gain2}
          onChange={(e) => setGain(data.gain1, +e.target.value)}
        />
        <p className={tw('text-right text-xs')}>{parseFloat(gain2).toFixed(2)}</p>
      </label>

      <label className={tw('flex flex-col px-2 pt-1 pb-2')}>
        <p className={tw('text-xs font-bold mb-2')}>Waveform</p>
        <select
          className="nodrag"
          value={data.type}
          onChange={(e) => setGain(data.gain1, data.gain2, e.target.value)}
        >
          <option value="sine">sine</option>
          <option value="triangle">triangle</option>
          <option value="sawtooth">sawtooth</option>
          <option value="square">square</option>
        </select>
      </label>

      <Handle className={tw('w-2 h-2')} type="source" position="bottom" />
    </div>
  );
}
