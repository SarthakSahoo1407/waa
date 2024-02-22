// import React from "react";
import { Handle } from "reactflow";
import { shallow } from "zustand/shallow";
import { tw } from "twind";
import { useStore } from "../store";

const selector = (id) => (store) => ({
  setFrequency: (e) => store.updateNode(id, { frequency: +e.target.value }),
  setType: (e) => store.updateNode(id, { type: e.target.value }),
});

export default function Osc({ id, data }) {
  const { setFrequency, setType } = useStore(selector(id), shallow);

  return (
        <div className={tw("rounded-md bg-white shadow-xl")}>
          <p
            className={tw("rounded-t-md px-2 py-1 bg-pink-500 text-white text-sm")}
          >
            Input Node
          </p>
    
          <label className={tw("flex flex-col px-2 py-1")}>
            <p className={tw("text-xs text-black font-bold mb-2 p-")}>Parameter1</p>
            <input
            id="param1"
              className="text-xs font-bold mb-2 p-"
              // c
              type="text"
            />
            <span>
              {/* show param1  */}
              
            </span>
            <p className={tw("text-xs text-black font-bold mb-2 p-")}>Parameter2</p>
            <input
              className="text-xs font-bold mb-2 p-"
              // c
              type="text"
            />
            {/* <p className={tw('text-right text-black text-xs')}>{data.frequency} Hz</p> */}
          </label>
    
          <hr className={tw("border-gray-200 mx-2")} />
    
          <label className={tw("flex flex-col px-2 pt-1 pb-4")}>
            <p className={tw("text-xs  text-black font-bold mb-2")}>Waveform</p>
            <select className="nodrag" onChange={setType}>
              <option value="linear">Linear</option>
              <option value="reLu">ReLu</option>
              <option value="conv">Conv</option>
              <option value="softmax">Softmax</option>
            </select>
          </label>
    
          <Handle className={tw("w-2 h-2")} type="source" position="bottom" />
        </div>
      );
}
