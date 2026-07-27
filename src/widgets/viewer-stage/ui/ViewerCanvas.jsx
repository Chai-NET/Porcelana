const ViewerCanvas = ({
  mountRef,
  onMouseDown,
  onContextMenu,
  isDragging,
  isPanning,
}) => (
  <div
    ref={mountRef}
    className={`absolute inset-0 ${
      isPanning ? "cursor-move" : isDragging ? "cursor-grabbing" : "cursor-grab"
    }`}
    onMouseDown={onMouseDown}
    onContextMenu={onContextMenu}
  />
);

export default ViewerCanvas;
