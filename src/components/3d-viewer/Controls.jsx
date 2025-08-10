import React from "react";
import { RotateCcw } from "lucide-react";
import ScreenButton from "./FullScreenButon.jsx";

const Controls = ({ onReset }) => (
  <div className="fixed top-3 right-3 flex gap-2">
    <ScreenButton className="shadow-darkBlack from-dark25 to-dark35 border-dark44 hover:border-accent hover:text-accent cursor-pointer rounded-lg border-2 bg-gradient-to-tl from-10% p-1 text-left text-sm text-nowrap text-zinc-300 transition-all duration-300 ease-in-out hover:bg-zinc-100" />
    <button
      onClick={onReset}
      className="shadow-darkBlack from-dark25 to-dark35 border-dark44 hover:border-accent hover:text-accent cursor-pointer rounded-lg border-2 bg-gradient-to-tl from-10% p-1 text-left text-sm text-nowrap text-zinc-300 transition-all duration-300 ease-in-out hover:bg-zinc-100"
      title="Reset Camera"
    >
      <RotateCcw size={20} />
    </button>
  </div>
);

export default Controls;
