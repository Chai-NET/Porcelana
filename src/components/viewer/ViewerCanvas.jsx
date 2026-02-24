const ViewerCanvas = ({ mountRef, onMouseDown }) => (
  <div
    ref={mountRef}
    className="absolute inset-0 cursor-grab active:cursor-grabbing"
    onMouseDown={onMouseDown}
  />
);

export default ViewerCanvas;
