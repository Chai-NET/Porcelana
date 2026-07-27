import { useState } from "react";
import { Upload } from "lucide-react";

const FileUpload = ({ onSelectFile }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onSelectFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="group mb-6 transition-all duration-500 ease-in-out">
      <label
        className={`shadow-dark25/0 flex h-24 w-full cursor-pointer items-center justify-center rounded-2xl border-[0.14rem] border-dashed shadow-lg transition-all duration-500 ease-in-out @xs:h-30 @sm:h-35 ${
          isDragOver
            ? "border-zinc-100 bg-zinc-800/50 shadow-white/30"
            : "border-zinc-600 group-hover:border-zinc-100 group-hover:shadow-white/30"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="font-mozilla px-3 text-center">
          <Upload
            className={`mx-auto mb-2 size-7 stroke-1 transition-normal duration-700 ease-in-out @xs:mb-3 @xs:size-9 ${
              isDragOver ? "stroke-3" : "group-hover:stroke-3"
            }`}
            size={24}
          />
          <span
            className={`text-xs font-semibold transition-all duration-500 text-shadow-none text-shadow-zinc-600 @xs:text-sm ${
              isDragOver
                ? "text-white text-shadow-md"
                : "text-zinc-300 group-hover:text-white group-hover:text-shadow-md"
            }`}
          >
            {isDragOver
              ? "Drop file here"
              : "Drop file here or click to browse"}
          </span>
          <div className="mt-1 text-[0.6rem] text-gray-400">
            GLB format only
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".glb"
          onChange={(e) => onSelectFile(e.target.files[0])}
        />
      </label>
    </div>
  );
};

export default FileUpload;
