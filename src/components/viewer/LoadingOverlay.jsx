const LoadingOverlay = ({ loadingProgress }) => {
  if (loadingProgress === null) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <p className="font-jost text-base tracking-wide text-zinc-300">
          Loading model...
        </p>

        {/* Progress bar */}
        <div className="w-56 overflow-hidden rounded-full bg-zinc-700/80">
          <div
            className="bg-accent h-1.5 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        <p className="font-mono text-sm tabular-nums text-zinc-500">
          {loadingProgress}%
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
