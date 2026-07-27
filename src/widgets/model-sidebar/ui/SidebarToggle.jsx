import { LuChevronDown, LuChevronRight } from "react-icons/lu";

const SidebarToggle = ({ isCollapsed, onToggle }) => (
  <button
    onClick={onToggle}
    className={`bg-dark25 border-dark44 hover:text-accent hover:border-accent absolute top-1/2 -right-5 z-30 size-9 -translate-y-1/2 cursor-pointer rounded-full border p-2 text-white transition-all duration-1000 ease-in-out ${
      isCollapsed ? "rotate-0" : "rotate-90"
    }`}
    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
  >
    {isCollapsed ? (
      <LuChevronRight className="mx-auto" />
    ) : (
      <LuChevronDown className="mx-auto" />
    )}
  </button>
);

export default SidebarToggle;
