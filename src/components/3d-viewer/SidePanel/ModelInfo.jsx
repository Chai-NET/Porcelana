import { formatNumber } from "../utils/formatters";
import { IoCubeOutline } from "react-icons/io5";

const ModelInfo = ({ stats }) => (
  <div className="border-corner shadow-darkBlack rounded-lg border bg-zinc-700/30 p-4 shadow">
    <h3 className="font-jost my-3 mb-6 text-xl font-semibold">Model Info</h3>

    <div className="space-y-2 px-1 2xl:space-y-3">
      {/* Name */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Name:</span>
        <div className="text-accent flex items-center gap-1">
          <IoCubeOutline />
          <span className="font-mono">cube</span>
        </div>
      </div>

      {/* View mode */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">View mode:</span>
        <span className="font-mono">Wireframe</span>
      </div>

      {/* View mode */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">PBR material:</span>
        <span className="font-mono">NA</span>
      </div>

      {/* Format */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Format:</span>
        <span className="text-accent font-mono">{stats.format || "N/A"}</span>
      </div>

      {/* Triangles */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Triangles:</span>
        <span className="text-xl font-bold">
          {formatNumber(stats.triangles)}
        </span>
      </div>
      {/* Vertices */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Vertices:</span>
        <span className="text-xl font-bold">
          {formatNumber(stats.vertices)}
        </span>
      </div>
    </div>
  </div>
);

export default ModelInfo;
