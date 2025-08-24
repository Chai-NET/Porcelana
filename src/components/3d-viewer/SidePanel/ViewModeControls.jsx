import { Eye, EyeClosed } from "lucide-react";

const ViewModeControls = ({ viewMode, setViewMode }) => (
  <div className="border-dark44 relative mb-6 h-36 min-h-35 w-full rounded-2xl rounded-b-lg border">
    <h3 className="font-jost bg-dark25 absolute -top-3 mx-6 block px-1 text-sm">
      View modes
    </h3>
    <div className="absolute -bottom-6 w-full px-3">
      <div className="flex justify-between gap-1 md:px-3 2xl:gap-2">
        {[
          { key: "wireframe", label: "Wireframe" },
          { key: "matcap", label: "Matcap" },
          { key: "basecolor", label: "Base" },
          // Vertex Normals:
          { key: "normals", label: "Normals" },
          { key: "texture", label: "Texture" },
        ].map(({ key, label }) => (
          <div>
            <p
              className={`font-jost absolute -top-4 ml-7 origin-bottom-left -rotate-45 text-sm font-medium transition-colors delay-200 duration-500 ease-in-out ${
                viewMode === key ? "text-accent" : "text-zinc-300"
              }`}
            >
              {label}
            </p>

            {/* Arrows */}
            <div className="">
              {/* <div className="bg-dark44 -mb-1 ml-5 size-2 rounded-full" /> */}
              <div
                className={`ml-2 h-3 w-[2px] origin-bottom-left rotate-45 transition-colors delay-100 duration-300 ease-in-out ${
                  viewMode === key ? "bg-accent" : "bg-dark44"
                } `}
              />
              <div
                className={`ml-2 h-4 w-[2px] transition-colors duration-300 ${
                  viewMode === key ? "bg-accent" : "bg-dark44"
                } `}
              />
            </div>
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={`shadow-darkBlack from-dark25 to-dark35 relative size-12 cursor-pointer overflow-clip rounded-lg border-2 from-10% p-3 text-left text-sm text-nowrap transition-all duration-300 ease-in-out ${
                viewMode === key
                  ? "border-accent bg-gradient-to-bl text-white shadow-inner"
                  : "border-dark44 bg-gradient-to-tl text-zinc-300 hover:bg-zinc-100"
              }`}
            >
              {/* {label} */}

              <div className="">
                <Eye
                  size={20}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all delay-150 duration-700 ease-linear ${
                    viewMode === key
                      ? "stroke-accent opacity-100"
                      : "translate-y-1 stroke-white opacity-0"
                  } `}
                />
                <EyeClosed
                  size={20}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-white transition-all delay-75 duration-1000 ease-out ${
                    viewMode === key
                      ? "-translate-y-3 rotate-x-180 opacity-0"
                      : "rotate-0 opacity-100"
                  } `}
                />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ViewModeControls;
