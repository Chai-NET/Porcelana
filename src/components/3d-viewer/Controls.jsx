import React from "react";
import { RotateCcw } from "lucide-react";

const Controls = ({ onReset }) => (
  <div className="fixed top-4 right-4 flex gap-2">
    <button
      onClick={onReset}
      className="rounded bg-gray-700 p-2 transition-colors hover:bg-gray-600"
      title="Reset Camera"
    >
      <RotateCcw size={20} />
    </button>
  </div>
);

export default Controls;
