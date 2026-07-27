import { IoCubeOutline } from "react-icons/io5";
import { ExternalLink } from "lucide-react";
import { formatNumber, formatFileSize } from "@/shared/lib/format";
import { StatRow } from "@/shared/ui";
import { formatAssetCredit } from "../lib/formatCredit";

const AssetCard = ({ asset, onSelect, disabled }) => (
  <div
    className={`border-dark44 shadow-darkBlack from-dark25 to-dark44/45 group overflow-hidden rounded-lg border bg-gradient-to-bl shadow transition-all duration-300 ease-in-out ${
      disabled ? "opacity-40" : "hover:border-accent"
    }`}
  >
    <button
      onClick={() => onSelect(asset)}
      disabled={disabled}
      title={disabled ? "A model is already loading" : `Load ${asset.name}`}
      className={`w-full p-3 text-left ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <IoCubeOutline
          className={`shrink-0 transition-colors duration-300 ${
            disabled ? "text-zinc-400" : "text-accent"
          }`}
        />
        <span className="font-jost truncate text-sm font-semibold">
          {asset.name}
        </span>
      </div>

      <div className="font-jost space-y-1 text-xs">
        <StatRow label="File size:">
          <span className="font-mono">{formatFileSize(asset.fileSize)}</span>
        </StatRow>
        <StatRow label="Triangles:">
          <span className="font-mono font-bold">
            {formatNumber(asset.triangles)}
          </span>
        </StatRow>
        <StatRow label="Vertices:">
          <span className="font-mono font-bold">
            {formatNumber(asset.vertices)}
          </span>
        </StatRow>
      </div>
    </button>

    {/* Licensing obligation, not decoration: kept outside the button so the
        links stay clickable while a load is running (and an anchor nested in a
        button is invalid markup). */}
    <div className="border-dark44/60 font-jost border-t px-3 py-2 text-[0.65rem] leading-relaxed text-gray-400">
      <a
        href={asset.credit.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`View "${asset.name}" on Sketchfab`}
        className="hover:text-accent inline-flex items-center gap-1 transition-colors duration-300"
      >
        <span className="truncate">
          {formatAssetCredit(asset.name, asset.credit.creator)}
        </span>
        <ExternalLink size={10} className="shrink-0" />
      </a>
      <div>
        Licensed under{" "}
        <a
          href={asset.credit.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent underline underline-offset-2 transition-colors duration-300"
        >
          {asset.credit.license}
        </a>
      </div>
    </div>
  </div>
);

export default AssetCard;
