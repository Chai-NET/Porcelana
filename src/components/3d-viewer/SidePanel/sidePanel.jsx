import FileUpload from "./FileUpload";
import ViewModeControls from "./ViewModeControls";
import ModelInfo from "./ModelInfo";
import TitlePanel from "./TitlePanel";
import Instructions from "./Instructions";

const SidePanel = ({ viewMode, setViewMode, stats, onFileUpload }) => (
  <div className="bg-midBlack border-corner fixed flex h-dvh flex-col border-r p-6 md:w-120 2xl:w-100">
    <TitlePanel />
    <FileUpload onFileUpload={onFileUpload} />
    <ViewModeControls viewMode={viewMode} setViewMode={setViewMode} />
    <ModelInfo stats={stats} />
    {/* <Instructions /> */}
  </div>
);

export default SidePanel;
