import { Eye } from "lucide-react";

const ViewModes = ({ viewMode, setViewMode }) => (
  <div className="absolute top-3 left-1/2 z-30 flex -translate-x-1/2 items-center justify-center">
    <div className="flex justify-between gap-3">
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

export default ViewModes;
