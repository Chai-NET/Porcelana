import { Eye } from "lucide-react";

const ViewModeControls = ({ viewMode, setViewMode }) => (
  <div className="mb-6">
    <label className="font-Poppins mb-3 block text-sm font-semibold">
      View modes
    </label>
    <div className="flex justify-between gap-1 2xl:gap-3">
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
          className={`rounded-xl border-2 p-3 text-left text-sm text-nowrap transition-colors md:p-4 2xl:p-5 ${
            viewMode === key
              ? "border-accent text-white"
              : "border-zinc-600 bg-zinc-700 text-zinc-300 hover:bg-gray-600"
          }`}
        >
          {/* {label} */}
          <Eye size={16} className="inline" />
        </button>
      ))}
    </div>
  </div>
);

export default ViewModeControls;
