import { useState, useEffect } from "react";
import { useScreenSize } from "@/shared/lib/hooks/useScreenSize";
import { FileUpload } from "@/features/load-model";
import { ViewModeControls } from "@/features/switch-view-mode";
import { ModelInfo } from "@/entities/model";
import TitlePanel from "./TitlePanel";
import SidebarToggle from "./SidebarToggle";

const COLLAPSE_BREAKPOINT = 1150;

const ModelSidebar = ({ viewMode, setViewMode, stats, onSelectFile }) => {
  const { isSmallScreen: shouldCollapse } = useScreenSize(COLLAPSE_BREAKPOINT);
  const [isCollapsed, setIsCollapsed] = useState(shouldCollapse);

  useEffect(() => {
    setIsCollapsed(shouldCollapse);
  }, [shouldCollapse]);

  return (
    <div
      className={`border-dark44 from-dark25/45 absolute top-0 left-0 flex h-dvh flex-col justify-start gap-6 border-r bg-gradient-to-b from-35% to-[#2C2C2C] p-6 backdrop-blur-3xl transition-all duration-500 ease-linear ${
        isCollapsed ? "w-0" : "md:w-100 2xl:w-100"
      }`}
    >
      <SidebarToggle
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed((collapsed) => !collapsed)}
      />

      <div
        className={`flex flex-col gap-1 transition-all duration-1000 ease-in-out md:gap-3 2xl:gap-6 ${
          isCollapsed
            ? "pointer-events-none -translate-x-120 opacity-0"
            : "translate-x-0 opacity-100"
        }`}
      >
        <TitlePanel />
        <FileUpload onSelectFile={onSelectFile} />
        <ViewModeControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          hasOriginal={!!stats.materialAnalysis}
        />
        <ModelInfo stats={stats} />
        <h2 className="font-jost mx-auto py-3 text-center text-xs font-light">
          © {new Date().getFullYear()} | ChaiNET FOSS Project | chainet.dev{" "}
          <br />
          Developed and maintained by Pluwia | plu.moe
        </h2>
      </div>
    </div>
  );
};

export default ModelSidebar;
