import {
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_RESIZE_STEP,
} from "../config/sidebar";

const SidebarResizeHandle = ({
  width,
  isResizing,
  onResizeStart,
  onResizeBy,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") onResizeBy(-SIDEBAR_RESIZE_STEP);
    else if (event.key === "ArrowRight") onResizeBy(SIDEBAR_RESIZE_STEP);
    else return;
    event.preventDefault();
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuenow={width}
      aria-valuemin={SIDEBAR_MIN_WIDTH}
      aria-valuemax={SIDEBAR_MAX_WIDTH}
      tabIndex={0}
      onPointerDown={onResizeStart}
      onKeyDown={handleKeyDown}
      className="group absolute top-0 -right-1 z-20 flex h-full w-2 cursor-col-resize justify-center outline-none"
    >
      <span
        className={`h-full w-[2px] transition-colors duration-300 ease-in-out ${
          isResizing
            ? "bg-accent"
            : "group-hover:bg-accent/60 group-focus:bg-accent/60 bg-transparent"
        }`}
      />
    </div>
  );
};

export default SidebarResizeHandle;
