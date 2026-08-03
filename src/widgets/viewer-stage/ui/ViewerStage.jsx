import ViewerCanvas from "./ViewerCanvas";
import LoadingOverlay from "./LoadingOverlay";
import ScreenAlert from "./ScreenAlert";
import ErrorMessage from "./ErrorMessage";
import ZoomIndicator from "./ZoomIndicator";

const ViewerStage = ({
  mountRef,
  interaction,
  loadingProgress,
  error,
  zoomLevel,
  isZoomUnlocked,
  zoomBlockedCount,
  onToggleZoomLock,
  children,
}) => (
  <div className="relative flex-1 overflow-hidden">
    <ViewerCanvas
      mountRef={mountRef}
      onMouseDown={interaction.handleMouseDown}
      onContextMenu={interaction.handleContextMenu}
      isDragging={interaction.isDragging}
      isPanning={interaction.isPanning}
    />
    <LoadingOverlay loadingProgress={loadingProgress} />
    <ScreenAlert />
    <ErrorMessage error={error} />
    {children}
    {loadingProgress === null && !error && (
      <ZoomIndicator
        zoomLevel={zoomLevel}
        isZoomUnlocked={isZoomUnlocked}
        zoomBlockedCount={zoomBlockedCount}
        onToggleZoomLock={onToggleZoomLock}
      />
    )}
  </div>
);

export default ViewerStage;
