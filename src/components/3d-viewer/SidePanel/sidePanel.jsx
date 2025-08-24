import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import ViewModeControls from "./ViewModeControls";
import ModelInfo from "./ModelInfo";
import TitlePanel from "./TitlePanel";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";

const SidePanel = ({ viewMode, setViewMode, stats, onFileUpload }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 1000) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`border-dark44 from-dark25/45 absolute top-0 left-0 flex h-dvh flex-col justify-start gap-6 border-r bg-gradient-to-b from-35% to-[#2C2C2C] p-6 backdrop-blur-3xl transition-all duration-500 ease-linear ${
        isCollapsed ? "w-0" : "md:w-100 2xl:w-100"
      }`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={toggleCollapse}
        className={`bg-dark25 border-dark44 hover:text-accent hover:border-accent absolute top-1/2 z-30 size-9 -translate-y-1/2 cursor-pointer rounded-full border p-2 text-white transition-all duration-1000 ease-in-out ${
          isCollapsed ? "-right-5 rotate-0" : "-right-5 rotate-90"
        }`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <LuChevronRight className="mx-auto" />
        ) : (
          <LuChevronDown className="mx-auto" />
        )}
      </button>

      <div
        className={`flex flex-col gap-1 transition-all duration-1000 ease-in-out md:gap-3 2xl:gap-6 ${
          isCollapsed
            ? "pointer-events-none -translate-x-120 opacity-0"
            : "translate-x-0 opacity-100"
        } `}
      >
        <TitlePanel />
        <FileUpload onFileUpload={onFileUpload} />
        <ViewModeControls viewMode={viewMode} setViewMode={setViewMode} />
        <ModelInfo stats={stats} />
        <h2 className="font-jost mx-auto py-3 text-center text-xs font-light">
          © 2025 | ChaiNET FOSS Project | chainet.dev <br />
          Developed and maintained by Pluwia | plu.moe
        </h2>
      </div>
    </div>
  );
};

export default SidePanel;
