import { useState } from "react";
import { Upload } from "lucide-react";

const FileUpload = ({ onFileUpload }) => {
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

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const syntheticEvent = {
        target: {
          files: files,
        },
      };
      onFileUpload(syntheticEvent);
    }
  };

  const handleFileInputChange = (e) => {
    onFileUpload(e);
  };

  return (
    <div className="group mb-6 transition-all duration-500 ease-in-out">
      <label
        className={`shadow-dark25/0 flex h-35 w-full cursor-pointer items-center justify-center rounded-2xl border-[0.14rem] border-dashed shadow-lg transition-all duration-500 ease-in-out 2xl:h-45 ${
          isDragOver
            ? "border-zinc-100 bg-zinc-800/50 shadow-white/30"
            : "border-zinc-600 group-hover:border-zinc-100 group-hover:shadow-white/30"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="font-mozilla text-center">
          <Upload
            className={`mx-auto mb-3 size-9 stroke-1 transition-normal duration-700 ease-in-out ${
              isDragOver ? "stroke-3" : "group-hover:stroke-3"
            }`}
            size={24}
          />
          <span
            className={`text-base font-semibold transition-all duration-500 text-shadow-none text-shadow-zinc-600 ${
              isDragOver
                ? "text-white text-shadow-md"
                : "text-zinc-300 group-hover:text-white group-hover:text-shadow-md"
            }`}
          >
            {isDragOver
              ? "Drop file here"
              : "Drop file here or click to browse"}
          </span>
          <div className="mt-1 text-xs text-gray-400">GLB format only</div>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".glb"
          onChange={handleFileInputChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
