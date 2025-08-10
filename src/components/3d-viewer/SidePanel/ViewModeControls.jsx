import { Eye } from "lucide-react";
import { div } from "three/tsl";

const ViewModeControls = ({ viewMode, setViewMode }) => (
  <div className="relative mb-6 h-35 w-full rounded-2xl rounded-b-lg border border-zinc-300">
    <h3 className="font-jost bg-dark25 absolute -top-3 mx-6 block px-1 text-sm">
      View modes
    </h3>
    <div className="absolute -bottom-6 w-full px-3">
      <div className="flex justify-between gap-1 2xl:gap-3">
        {[
          { key: "wireframe", label: "Wireframe" },
          { key: "matcap", label: "Matcap" },
          { key: "basecolor", label: "Base" },
          // Vertex Normals:
          { key: "normals", label: "Normals" },
          { key: "texture", label: "Texture" },
        ].map(({ key, label }) => (
          <div>
            <p className="absolute -top-6 ml-3 origin-center -rotate-45 text-xs text-zinc-300">
              {label}
            </p>
            <div className="bg-dark44 ml-2 h-3 w-[2px] origin-bottom-left rotate-45" />

            <div className="bg-dark44 ml-2 h-6 w-[2px]" />
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`shadow-darkBlack from-dark25 to-dark44 cursor-pointer rounded-lg border-2 from-25% p-3 text-left text-sm text-nowrap transition-all duration-300 ease-in-out 2xl:p-4 ${
                viewMode === key
                  ? "border-accent bg-gradient-to-bl text-white shadow-inner"
                  : "border-dark44 bg-gradient-to-t text-zinc-300 hover:bg-zinc-100"
              }`}
            >
              {/* {label} */}
              <Eye size={20} className="inline" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ViewModeControls;
