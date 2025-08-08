import React from "react";
import FileUpload from "./FileUpload";
import ViewModeControls from "./ViewModeControls";
import ModelInfo from "./ModelInfo";
import Instructions from "./Instructions";

const SidePanel = ({ viewMode, setViewMode, stats, onFileUpload }) => (
  <div className="fixed flex h-dvh w-80 flex-col bg-gray-800 p-6">
    <h2 className="text-3xl font-bold">Porcelana</h2>
    <h3 className="mb-6 text-sm font-light">3D model viewer</h3>
    <FileUpload onFileUpload={onFileUpload} />
    <ViewModeControls viewMode={viewMode} setViewMode={setViewMode} />
    <ModelInfo stats={stats} />
    <Instructions />
  </div>
);

export default SidePanel;
