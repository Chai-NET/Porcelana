const ZoomIndicator = ({ zoomLevel }) => {
  const progressPercentage = ((zoomLevel - 100) / (200 - 100)) * 100;

  return (
    <div className="absolute right-3 bottom-3">
      <div className="bg-dark25 border-dark44 rounded-lg border px-4 py-3 backdrop-blur-sm">
        <div className="flex min-w-[200px] items-center space-x-3">
          {/* Zoom percentage display */}
          <div className="min-w-[3rem] text-center font-mono text-sm tracking-widest text-zinc-100">
            {zoomLevel}%
          </div>

          {/* Progress bar container */}
          <div className="relative flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-700">
              {/* Progress fill */}
              <div
                className="from-accent border-dark44 h-full rounded-full border bg-gradient-to-l to-zinc-900 transition-all duration-150 ease-out"
                style={{
                  width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
                }}
              />
            </div>

            {/* Tick marks */}
            <div className="pointer-events-none absolute top-0 left-0 flex h-2 w-full items-center justify-between">
              <div className="-mt-0.5 h-3 w-0.5 rounded-full bg-zinc-300" />
              <div className="-mt-0.5 h-3 w-0.5 rounded-full bg-zinc-300" />
              <div className="-mt-0.5 h-3 w-0.5 rounded-full bg-zinc-300" />
            </div>
          </div>

          {/* Zoom labels */}
          <div className="flex flex-col text-xs leading-tight text-gray-400">
            <span>1x - 2x</span>
            <span className="text-zinc-300">Zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomIndicator;
