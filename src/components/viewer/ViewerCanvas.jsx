const ViewerCanvas = ({ mountRef, onMouseDown, isDragging, isPanning }) => (
  <div
    ref={mountRef}
    className={`absolute inset-0 ${
      isPanning
        ? "cursor-move"
        : isDragging
          ? "cursor-grabbing"
          : "cursor-grab"
    }`}
    onMouseDown={onMouseDown}
  />
);

export default ViewerCanvas;
