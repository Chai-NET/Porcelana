import React from "react";
import { Upload } from "lucide-react";

const FileUpload = ({ onFileUpload }) => (
  <div className="mb-6">
    <label className="mb-2 block text-sm font-medium">Upload 3D Model</label>
    <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-600 transition-colors hover:border-gray-500">
      <div className="text-center">
        <Upload className="mx-auto mb-2" size={24} />
        <span className="text-sm text-gray-300">
          Drop file here or click to browse
        </span>
        <div className="mt-1 text-xs text-gray-400">Supports GLB only</div>
      </div>
      <input
        type="file"
        className="hidden"
        accept=".glb"
        onChange={onFileUpload}
      />
    </label>
  </div>
);

export default FileUpload;
