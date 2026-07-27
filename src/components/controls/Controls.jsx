import { RotateCcw } from "lucide-react";
import FullscreenButton from "./FullscreenButton";
import AssetBrowserButton from "./AssetBrowserButton";

const CONTROL_BUTTON_CLASS =
  "shadow-darkBlack from-dark25 to-dark35 border-dark44 hover:border-accent hover:text-accent cursor-pointer rounded-lg border-2 bg-gradient-to-tl from-10% p-1 text-left text-sm text-nowrap text-zinc-300 transition-all duration-300 ease-in-out hover:bg-zinc-100";

const Controls = ({ onReset, onSelectAsset, isLoading }) => (
  <div className="fixed top-3 right-3 z-40 flex gap-2">
    <AssetBrowserButton
      className={CONTROL_BUTTON_CLASS}
      onSelectAsset={onSelectAsset}
      isLoading={isLoading}
    />
    <FullscreenButton className={CONTROL_BUTTON_CLASS} />
    <button
      onClick={onReset}
      className={CONTROL_BUTTON_CLASS}
      title="Reset Camera"
    >
      <RotateCcw size={20} />
    </button>
  </div>
);

export default Controls;
