import { useRef } from "react";
import {
  Trash2,
  Focus,
  Play,
  Square,
  Lightbulb,
  LightbulbOff,
} from "lucide-react";
import { useDismiss } from "@/shared/lib/hooks/useDismiss";
import { MENU_WIDTH_PX, MENU_HEIGHT_PX } from "../config/menu";

const ViewerOptionsMenu = ({
  position,
  onClose,
  onResetViewer,
  onRepositionCamera,
  isTurntableActive,
  onToggleTurntable,
  isLightOn,
  onToggleLight,
}) => {
  const menuRef = useRef(null);
  useDismiss(menuRef, true, onClose);

  const items = [
    { label: "Reset viewer", Icon: Trash2, onSelect: onResetViewer },
    { label: "Reposition camera", Icon: Focus, onSelect: onRepositionCamera },
    {
      label: isTurntableActive ? "Stop turntable" : "Start turntable",
      Icon: isTurntableActive ? Square : Play,
      onSelect: onToggleTurntable,
    },
    {
      label: isLightOn ? "Turn lights off" : "Turn lights on",
      Icon: isLightOn ? LightbulbOff : Lightbulb,
      onSelect: onToggleLight,
    },
  ];

  return (
    <div
      ref={menuRef}
      role="menu"
      style={{
        left: Math.min(position.x, window.innerWidth - MENU_WIDTH_PX),
        top: Math.min(position.y, window.innerHeight - MENU_HEIGHT_PX),
      }}
      className="border-dark44 from-dark25/95 animate-fadeIn fixed z-50 w-48 rounded-lg border bg-gradient-to-b to-[#2C2C2C]/95 p-1.5 shadow-lg backdrop-blur-3xl"
    >
      {items.map((item) => (
        <button
          key={item.label}
          role="menuitem"
          onClick={() => {
            item.onSelect();
            onClose();
          }}
          className="font-jost hover:bg-dark35 hover:text-accent flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-zinc-300 transition-colors"
        >
          <item.Icon size={16} />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ViewerOptionsMenu;
