import React from "react";
import { Eye } from "lucide-react";

const ViewModeControls = ({ viewMode, setViewMode }) => (
  <div className="mb-6">
    <label className="mb-3 block text-sm font-medium">View Mode</label>
    <div className="grid grid-cols-2 gap-2">
      {[
        { key: "wireframe", label: "Wireframe" },
        { key: "matcap", label: "Matcap" },
        { key: "basecolor", label: "Base Color" },
        { key: "normals", label: "Vertex Normals" },
        { key: "texture", label: "Texture" },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setViewMode(key)}
          className={`rounded p-3 text-left transition-colors ${
            viewMode === key
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <Eye size={16} className="mr-2 inline" />
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default ViewModeControls;
