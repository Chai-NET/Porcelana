import { RotateCcw } from "lucide-react";
import { AssetBrowserButton } from "@/features/browse-assets";
import FullscreenButton from "./FullscreenButton";
import { TOOLBAR_BUTTON_CLASS } from "../config/toolbarButton";

const ViewerToolbar = ({ onReset, onSelectAsset, isLoading }) => (
  <div className="fixed top-3 right-3 z-40 flex gap-2">
    <AssetBrowserButton
      className={TOOLBAR_BUTTON_CLASS}
      onSelectAsset={onSelectAsset}
      isLoading={isLoading}
    />
    <FullscreenButton className={TOOLBAR_BUTTON_CLASS} />
    <button
      onClick={onReset}
      className={TOOLBAR_BUTTON_CLASS}
      title="Reset Camera"
      aria-label="Reset camera"
    >
      <RotateCcw size={20} />
    </button>
  </div>
);

export default ViewerToolbar;
