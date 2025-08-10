import { Upload } from "lucide-react";

const FileUpload = ({ onFileUpload }) => (
  <div className="group mb-6 transition-all duration-500 ease-in-out">
    <label className="shadow-midBlack/0 flex h-45 w-full cursor-pointer items-center justify-center rounded-2xl border-[0.14rem] border-dashed border-zinc-600 shadow-lg transition-all duration-500 ease-in-out group-hover:border-zinc-100 group-hover:shadow-white/30">
      <div className="font-mozilla text-center">
        <Upload
          className="mx-auto mb-3 size-9 stroke-1 transition-normal duration-700 ease-in-out group-hover:stroke-3"
          size={24}
        />
        <span className="text-base font-semibold text-zinc-300 transition-all duration-500 text-shadow-none text-shadow-zinc-600 group-hover:text-white group-hover:text-shadow-md">
          Drop file here or click to browse
        </span>
        <div className="mt-1 text-xs text-gray-400"> GLB format only</div>
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
