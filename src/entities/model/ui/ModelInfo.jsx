import { IoCubeOutline } from "react-icons/io5";
import { formatNumber } from "@/shared/lib/format";
import { StatRow } from "@/shared/ui";

const ModelInfo = ({ stats }) => {
  const { materialAnalysis: ma } = stats;

  return (
    <div className="border-dark44 shadow-darkBlack from-dark25 to-dark44/45 rounded-lg border bg-gradient-to-bl p-4 shadow">
      <h3 className="font-jost my-3 mb-6 text-lg font-semibold">Model Info</h3>

      <div className="font-jost space-y-1.5 px-1 text-sm">
        {/* Name */}
        <StatRow label="Name:">
          <div className="text-accent flex items-center gap-1">
            <IoCubeOutline />
            <span className="font-mono select-all">
              {stats.fileName ?? "Cube"}
            </span>
          </div>
        </StatRow>

        {/* File Size */}
        <StatRow label="File size:">
          <span className="font-mono">
            {stats.fileSizeMB ? `${stats.fileSizeMB} MB` : "N/A"}
          </span>
        </StatRow>

        {/* Format */}
        <StatRow label="Format:">
          <span className="text-accent font-mono">{stats.format || "N/A"}</span>
        </StatRow>

        {/* Geometry */}
        <StatRow label="Triangles:">
          <span className="font-bold">{formatNumber(stats.triangles)}</span>
        </StatRow>
        <StatRow label="Vertices:">
          <span className="font-bold">{formatNumber(stats.vertices)}</span>
        </StatRow>

        {/* Per-model data — only shown after upload */}
        {ma && (
          <>
            <div className="border-dark44 my-2 border-t" />

            <StatRow label="Meshes:">
              <span className="font-mono">{stats.meshCount}</span>
            </StatRow>

            <StatRow label="Materials:">
              <span className="font-mono">{ma.materialCount}</span>
            </StatRow>

            <StatRow label="PBR:">
              <span
                className={`rounded px-2 py-0.5 font-mono text-xs ${
                  ma.hasPBR
                    ? "bg-green-900/50 text-green-400"
                    : "bg-zinc-700/60 text-zinc-400"
                }`}
              >
                {ma.hasPBR ? "Yes" : "No"}
              </span>
            </StatRow>

            {ma.textureTypes.length > 0 && (
              <div className="pt-1">
                <span className="text-gray-300">Textures:</span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {ma.textureTypes.map((type) => (
                    <span
                      key={type}
                      className="border-dark44 bg-dark25 rounded border px-1.5 py-0.5 font-mono text-xs text-zinc-300 select-all"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {stats.dimensions && (
              <StatRow label="Dimensions:">
                <span className="font-mono text-xs text-zinc-400">
                  {stats.dimensions.width} × {stats.dimensions.height} ×{" "}
                  {stats.dimensions.depth}
                </span>
              </StatRow>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ModelInfo;
