import { FileUpload } from "@/features/load-model";
import { ViewModeControls } from "@/features/switch-view-mode";
import { ModelInfo } from "@/entities/model";
import { useSidebarCollapse } from "../model/useSidebarCollapse";
import { useSidebarResize } from "../model/useSidebarResize";
import TitlePanel from "./TitlePanel";
import SidebarToggle from "./SidebarToggle";
import SidebarResizeHandle from "./SidebarResizeHandle";

const ModelSidebar = ({ viewMode, setViewMode, stats, onSelectFile }) => {
  const { isCollapsed, toggle, collapse } = useSidebarCollapse();
  const { width, isResizing, startResize, resizeBy } = useSidebarResize({
    onSnapClosed: collapse,
  });

  return (
    <div
      style={{ width: isCollapsed ? 0 : width }}
      className={`border-dark44 from-dark25/45 absolute top-0 left-0 flex h-dvh flex-col justify-start gap-6 border-r bg-gradient-to-b from-35% to-[#2C2C2C] p-6 backdrop-blur-3xl ${
        isResizing ? "" : "transition-[width] duration-500 ease-linear"
      }`}
    >
      <SidebarToggle isCollapsed={isCollapsed} onToggle={toggle} />

      {!isCollapsed && (
        <SidebarResizeHandle
          width={width}
          isResizing={isResizing}
          onResizeStart={startResize}
          onResizeBy={resizeBy}
        />
      )}

      <div
        className={`scrollbar-slim @container flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto transition-[transform,opacity] duration-700 ease-in-out @xs:gap-6 ${
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
        <h2 className="font-jost mx-auto py-3 text-center text-xs font-light text-balance">
          © {new Date().getFullYear()} | ChaiNET FOSS Project | chainet.dev{" "}
          <br />
          Developed and maintained by Pluwia | plu.moe
        </h2>
      </div>
    </div>
  );
};

export default ModelSidebar;
