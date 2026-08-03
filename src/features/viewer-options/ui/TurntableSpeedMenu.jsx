import { Check } from "lucide-react";
import { TURNTABLE_SPEEDS, DEFAULT_TURNTABLE_SPEED } from "@/entities/scene";

const TurntableSpeedMenu = ({ speed, onSelect }) => (
  <div
    role="menu"
    aria-label="Turntable speed"
    className="border-dark44 from-dark25/95 w-30 rounded-lg border bg-gradient-to-b to-[#2C2C2C]/95 p-1.5 shadow-lg backdrop-blur-3xl"
  >
    {TURNTABLE_SPEEDS.map((value) => {
      const isSelected = value === speed;

      return (
        <button
          key={value}
          role="menuitemradio"
          aria-checked={isSelected}
          onClick={() => onSelect(value)}
          className={`font-jost hover:bg-dark35 hover:text-accent flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
            isSelected ? "text-accent" : "text-zinc-300"
          }`}
        >
          <span className="flex-1">{value}x</span>
          {isSelected ? (
            <Check size={14} />
          ) : (
            value === DEFAULT_TURNTABLE_SPEED && (
              <span className="text-[10px] text-zinc-500">default</span>
            )
          )}
        </button>
      );
    })}
  </div>
);

export default TurntableSpeedMenu;
