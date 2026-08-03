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
import { placeMenu } from "../lib/menuPlacement";
import OptionsMenuItem from "./OptionsMenuItem";
import TurntableSpeedMenu from "./TurntableSpeedMenu";

const ViewerOptionsMenu = ({
  position,
  onClose,
  onResetViewer,
  onRepositionCamera,
  isTurntableActive,
  onToggleTurntable,
  turntableSpeed,
  onSelectTurntableSpeed,
  isLightOn,
  onToggleLight,
}) => {
  const menuRef = useRef(null);
  useDismiss(menuRef, true, onClose);

  const { left, top, flipSubmenu } = placeMenu(position);

  const items = [
    {
      label: "Reset viewer",
      icon: <Trash2 size={16} />,
      onSelect: onResetViewer,
    },
    {
      label: "Reposition camera",
      icon: <Focus size={16} />,
      onSelect: onRepositionCamera,
    },
    {
      label: isTurntableActive ? "Stop turntable" : "Start turntable",
      icon: isTurntableActive ? <Square size={16} /> : <Play size={16} />,
      onSelect: onToggleTurntable,
      submenu: (
        <TurntableSpeedMenu
          speed={turntableSpeed}
          onSelect={(speed) => {
            onSelectTurntableSpeed(speed);
            onClose();
          }}
        />
      ),
    },
    {
      label: isLightOn ? "Turn lights off" : "Turn lights on",
      icon: isLightOn ? <LightbulbOff size={16} /> : <Lightbulb size={16} />,
      onSelect: onToggleLight,
    },
  ];

  return (
    <div
      ref={menuRef}
      role="menu"
      style={{ left, top }}
      className="border-dark44 from-dark25/95 animate-fadeIn fixed z-50 w-48 rounded-lg border bg-gradient-to-b to-[#2C2C2C]/95 p-1.5 shadow-lg backdrop-blur-3xl"
    >
      {items.map((item) => (
        <OptionsMenuItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          submenu={item.submenu}
          flipSubmenu={flipSubmenu}
          onSelect={() => {
            item.onSelect();
            onClose();
          }}
        />
      ))}
    </div>
  );
};

export default ViewerOptionsMenu;
