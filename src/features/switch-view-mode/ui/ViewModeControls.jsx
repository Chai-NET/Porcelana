import { Eye, EyeClosed } from "lucide-react";
import { VIEW_MODES } from "../config/viewModes";

const ViewModeControls = ({ viewMode, setViewMode, hasOriginal }) => (
  <div className="border-dark44 relative mb-6 h-36 min-h-35 w-full rounded-2xl rounded-b-lg border">
    <h3 className="font-jost bg-dark25 absolute -top-3 mx-6 block px-1 text-sm">
      View modes
    </h3>
    <div className="absolute -bottom-6 w-full px-3">
      <div className="flex justify-between gap-1 md:px-3 2xl:gap-1.5">
        {VIEW_MODES.map(({ key, label, requiresModel }) => {
          const isActive = viewMode === key;
          const isDisabled = requiresModel && !hasOriginal;

          return (
            <div key={key}>
              <p
                className={`font-jost absolute -top-2 ml-6 origin-bottom-left -rotate-45 text-xs font-normal transition-colors delay-200 duration-500 ease-in-out select-all ${
                  isActive
                    ? "text-accent"
                    : isDisabled
                      ? "text-zinc-600"
                      : "text-zinc-300"
                }`}
              >
                {label}
              </p>

              {/* Arrows */}
              <div>
                <div
                  className={`ml-2 h-3 w-[2px] origin-bottom-left rotate-45 transition-colors delay-100 duration-300 ease-in-out ${
                    isActive ? "bg-accent" : "bg-dark44"
                  }`}
                />
                <div
                  className={`ml-2 h-4 w-[2px] transition-colors duration-300 ${
                    isActive ? "bg-accent" : "bg-dark44"
                  }`}
                />
              </div>
              <button
                onClick={() => setViewMode(key)}
                disabled={isDisabled}
                title={
                  isDisabled
                    ? "Upload a model to view its own materials"
                    : label
                }
                className={`shadow-darkBlack from-dark25 group to-dark35 relative size-11 overflow-clip rounded-lg border-2 from-10% p-3 text-left text-sm text-nowrap transition-all duration-300 ease-in-out ${
                  isActive
                    ? "border-accent bg-gradient-to-bl text-white shadow-inner"
                    : isDisabled
                      ? "border-dark44/50 bg-dark25/40 cursor-not-allowed opacity-40"
                      : "border-dark44 hover:border-accent/50 cursor-pointer bg-gradient-to-tl text-zinc-300 hover:bg-zinc-100"
                }`}
              >
                <div>
                  <Eye
                    size={20}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all delay-150 duration-700 ease-linear ${
                      isActive
                        ? "stroke-accent opacity-100"
                        : "translate-y-1 stroke-white opacity-0"
                    }`}
                  />
                  <EyeClosed
                    size={20}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-white transition-all delay-75 duration-1000 ease-out ${
                      isActive
                        ? "-translate-y-3 rotate-x-180 opacity-0"
                        : `rotate-0 opacity-100 ${isDisabled ? "" : "group-hover:size-6"}`
                    }`}
                  />
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default ViewModeControls;
