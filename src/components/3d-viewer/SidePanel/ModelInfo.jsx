import React from "react";
import { formatNumber } from "../utils/formatters";

const ModelInfo = ({ stats }) => (
  <div className="rounded-lg bg-gray-700 p-4">
    <h3 className="mb-3 text-lg font-semibold">Model Info</h3>

    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-300">Format:</span>
        <span className="font-mono text-blue-400">{stats.format || "N/A"}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-300">Triangles:</span>
        <span className="text-xl font-bold">
          {formatNumber(stats.triangles)}
        </span>
      </div>

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
