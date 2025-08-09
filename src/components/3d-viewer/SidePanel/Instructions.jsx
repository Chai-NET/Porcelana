export default function Instructions() {
  return (
    <>
      <div className="font-jost text-gray-400">
        <div className="my-1 mt-6 h-[1px] w-full bg-gray-600" />
        <h4 className="my-2 font-semibold">How to use:</h4>
        <ul className="list-decimal space-y-1 pl-5 text-xs">
          <li>Upload your own 3D model.</li>
          <li>Click and drag to rotate.</li>
          <li>Use view modes to inspect.</li>
          <li>Check model info for model details.</li>
        </ul>
      </div>
    </>
  );
}
