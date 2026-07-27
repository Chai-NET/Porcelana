import { useState, useRef, useCallback } from "react";
import { Keyboard } from "lucide-react";
import { useDismiss } from "@/shared/lib/hooks/useDismiss";
import KeybindsPanel from "./KeybindsPanel";

const KeybindsButton = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);
  useDismiss(containerRef, isOpen, close);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className={className}
        title="Keybinds"
        aria-label="Show keybinds"
        aria-expanded={isOpen}
      >
        <Keyboard size={20} />
      </button>

      {isOpen && <KeybindsPanel />}
    </div>
  );
};

export default KeybindsButton;
