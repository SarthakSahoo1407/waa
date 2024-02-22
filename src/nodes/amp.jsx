import React from 'react';
import { Handle } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { tw } from 'twind';
import { useStore } from '../store';

const selector = (id) => (store) => ({
  setGain: (e) => store.updateNode(id, { gain: +e.target.value }),
});

export default function Amp({ id, data }) {
  const { setGain } = useStore(selector(id), shallow);

  return (
    <div className={tw('rounded-md bg-white shadow-xl')}>
      <Handle className={tw('w-2 h-2')} type="target" position="top" />

      <p className={tw('rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm')}>Nodes</p>
      <label className={tw('flex flex-col px-2 pt-1 pb-4')}>
        <p className={tw('text-xs font-bold mb-2')}>Parameter1</p>
        <input
              className="text-xs font-bold mb-2 p-"
              // c
              type="text"
            />
        <p className={tw('text-xs font-bold mb-2')}>Parameter2</p>
             <input
              className="text-xs font-bold mb-2 p-"
              // c
              type="text"
            />
        {/* <p className={tw('text-right text-xs')}>{data.gain.toFixed(2)}</p> */}
      </label>
      <label className={tw('flex flex-col px-2 pt-1 pb-4')}>
        <p className={tw('text-xs font-bold mb-2')}>Gain</p>
        <select className="nodrag" onChange={setGain}>
            <option value="linear">Linear</option>
            <option value="reLu">ReLu</option>
            <option value="conv">Conv</option>
            <option value="softmax">Softmax</option>
            </select>
        {/* <p className={tw('text-right text-xs')}>{data.gain.toFixed(2)}</p> */}
      </label>
      

      <Handle className={tw('w-2 h-2')} type="source" position="bottom" />
    </div>
  );
}
