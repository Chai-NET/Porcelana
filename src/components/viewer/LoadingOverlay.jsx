const LoadingOverlay = ({ isLoading }) =>
  isLoading && (
    <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
      <div className="text-xl">Loading 3D model...</div>
    </div>
  );

export default LoadingOverlay;
