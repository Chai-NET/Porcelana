import FileUpload from "./FileUpload";
import ViewModeControls from "./ViewModeControls";
import ModelInfo from "./ModelInfo";
import TitlePanel from "./TitlePanel";
import Instructions from "./Instructions";

const SidePanel = ({ viewMode, setViewMode, stats, onFileUpload }) => (
  <div className="bg-midBlack border-corner fixed flex h-dvh flex-col justify-between border-r p-6 md:w-90 2xl:w-100">
    <TitlePanel />
    <FileUpload onFileUpload={onFileUpload} />
    <ViewModeControls viewMode={viewMode} setViewMode={setViewMode} />
    <ModelInfo stats={stats} />
    <h2 className="font-jost mx-auto py-3 text-center text-sm font-light">
      © 2025 | ChaiNET FOSS Project | chainet.dev <br />
      Developed and maintained by Pluwia | plu.moe
    </h2>
    {/* <Instructions /> */}
  </div>
);

export default SidePanel;
