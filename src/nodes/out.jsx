// import React from 'react';F
import { Handle } from "reactflow";
import { shallow } from "zustand/shallow";
import { useStore } from "../store";
import { tw } from "twind";

const selector = (store) => ({
  isRunning: store.isRunning,
  toggleAudio: store.toggleAudio,
});

export default function Out({ id, data }) {
  const { isRunning, toggleAudio } = useStore(selector, shallow);

  return (
    
    <div className={tw("rounded-md bg-white shadow-xl px-4 py-2")}>
              <p className={tw('rounded-t-md px-2 py-1 bg-blue-500 text-white text-sm')}>Output Node</p>

      <Handle className={tw("w-2 h-2")} type="target" position="top" />

      {/* <button onClick={toggleAudio}>
        {isRunning ? (
          <span role="img" aria-label="mute">
            🔈
          </span>
        ) : (
          <span role="img" aria-label="unmute">
            🔇
          </span>
        )}
      </button> */}
    </div>
  );
}
