import { ChevronRight } from "lucide-react";

const OptionsMenuItem = ({ label, icon, onSelect, submenu, flipSubmenu }) => (
  <div role="none" className="group/item relative">
    <button
      role="menuitem"
      onClick={onSelect}
      className="font-jost hover:bg-dark35 hover:text-accent group-focus-within/item:bg-dark35 flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-zinc-300 transition-colors"
    >
      {icon}
      <span className="flex-1">{label}</span>
      {submenu && <ChevronRight size={14} className="text-zinc-500" />}
    </button>

    {submenu && (
      <div
        className={`invisible absolute top-0 z-10 group-focus-within/item:visible group-hover/item:visible ${
          flipSubmenu ? "right-full pr-1" : "left-full pl-1"
        }`}
      >
        {submenu}
      </div>
    )}
  </div>
);

export default OptionsMenuItem;
