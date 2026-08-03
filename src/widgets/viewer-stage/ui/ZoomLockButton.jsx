import { useState, useEffect } from "react";
import { Lock, LockOpen } from "lucide-react";

const REJECT_FLASH_MS = 450;

const ZoomLockButton = ({ isUnlocked, blockedCount, onToggle }) => {
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (!blockedCount) return;

    setIsRejecting(true);
    const timer = setTimeout(() => setIsRejecting(false), REJECT_FLASH_MS);
    return () => clearTimeout(timer);
  }, [blockedCount]);

  const stateClasses = isRejecting
    ? "border-red-500 text-red-400 shadow-[0_0_12px_rgba(248,113,113,0.55)]"
    : isUnlocked
      ? "border-accent text-accent"
      : "border-dark44 text-zinc-400 hover:text-zinc-100";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isUnlocked}
      aria-label={isUnlocked ? "Lock zoom limit" : "Unlock zoom limit"}
      title={
        isUnlocked ? "Lock zoom back to 200%" : "Unlock zoom past 200% limit"
      }
      className={`bg-dark25 flex cursor-pointer items-center self-stretch rounded-lg border px-3 backdrop-blur-sm transition-colors ${stateClasses}`}
    >
      <span className={`block ${isRejecting ? "animate-shake" : ""}`}>
        {isUnlocked ? <LockOpen size={16} /> : <Lock size={16} />}
      </span>
    </button>
  );
};

export default ZoomLockButton;
