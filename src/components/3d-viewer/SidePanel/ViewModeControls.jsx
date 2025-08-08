import { Eye } from "lucide-react";

const ViewModeControls = ({ viewMode, setViewMode }) => (
  <div className="mb-6">
    <label className="font-Poppins mb-3 block text-lg font-semibold">
      View Mode
    </label>
    <div className="grid grid-cols-2 gap-3">
      {[
        { key: "wireframe", label: "Wireframe" },
        { key: "matcap", label: "Matcap" },
        { key: "basecolor", label: "Base" },
        // Vertex Normals:
        { key: "normals", label: "Normals" },
        { key: "texture", label: "Texture" },
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setViewMode(key)}
          className={`flex w-full justify-between rounded p-3 text-left text-sm text-nowrap transition-colors ${
            viewMode === key
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {label}
          <Eye size={16} className="mr-3 inline" />
        </button>
      ))}
    </div>
  </div>
);

export default ViewModeControls;
