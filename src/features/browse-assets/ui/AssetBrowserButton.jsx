import { useState, useRef, useCallback } from "react";
import { Boxes } from "lucide-react";
import { useDismiss } from "@/shared/lib/hooks/useDismiss";
import AssetBrowser from "./AssetBrowser";

const AssetBrowserButton = ({ className, onSelectAsset, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);
  useDismiss(containerRef, isOpen, close);

  const handleSelect = (asset) => {
    onSelectAsset(asset);
    close();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className={className}
        title="Browse assets"
        aria-label="Browse assets"
        aria-expanded={isOpen}
      >
        <Boxes size={20} />
      </button>

      {isOpen && <AssetBrowser onSelect={handleSelect} isLoading={isLoading} />}
    </div>
  );
};

export default AssetBrowserButton;
