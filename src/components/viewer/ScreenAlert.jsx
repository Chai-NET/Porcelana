import { OctagonAlert } from "lucide-react";

const ScreenAlert = ({ isSmallScreen, screenWidth }) => (
  <div
    className={`absolute left-1/2 z-50 -translate-x-1/2 transition-all delay-150 duration-700 ease-linear ${
      isSmallScreen ? "top-6" : "-top-24"
    }`}
  >
    <div className="bg-dark25/45 overflow-clip rounded-lg border border-yellow-500/35 px-4 py-3 backdrop-blur-2xl">
      <div className="flex max-w-72 min-w-45 flex-col items-center space-x-3 md:flex-row">
        <OctagonAlert className="z-10 m-3 size-12 stroke-yellow-400 stroke-2 md:size-9" />
        <div className="absolute top-1/2 -left-16 size-32 -translate-y-1/2 animate-pulse rounded-full bg-yellow-300/25 blur-xl" />
        <div className="absolute top-1/2 -left-30 size-60 -translate-y-1/2 animate-ping rounded-full bg-yellow-600/15 blur-xl delay-150" />
        <div className="font-mozilla flex flex-col leading-tight text-zinc-400">
          <p className="track z-10 text-center text-sm text-zinc-100 md:text-left md:text-xs">
            Your screen width is:{" "}
            <span className="font-mozilla px-1 font-bold tracking-wider text-white">
              {screenWidth},
            </span>
            which is below the minimal app suggested pixel width (1250 px).
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default ScreenAlert;
