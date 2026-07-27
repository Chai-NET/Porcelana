import { PRESET_ASSETS } from "../../lib/presetAssets";
import AssetCard from "./AssetCard";

const AssetBrowser = ({ onSelect, isLoading }) => (
  <div className="border-dark44 from-dark25/95 animate-fadeIn absolute top-full right-0 z-50 mt-2 w-64 origin-top-right rounded-lg border bg-gradient-to-b to-[#2C2C2C]/95 p-3 shadow-lg backdrop-blur-3xl">
    <h3 className="font-jost mb-3 text-sm font-semibold">Asset library</h3>

    <div className="scrollbar-hide flex max-h-80 flex-col gap-2 overflow-y-auto">
      {PRESET_ASSETS.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onSelect={onSelect}
          disabled={isLoading}
        />
      ))}
    </div>
  </div>
);

export default AssetBrowser;
