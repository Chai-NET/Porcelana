import { useThreeScene } from "../hooks/useThreeScene";
import { useModelLoader } from "../hooks/useModelLoader";
import { useViewMode } from "../hooks/useViewMode";
import { useRotation } from "../hooks/useRotation";
import { useScreenSize } from "../hooks/useScreenSize";
import ViewerCanvas from "../components/viewer/ViewerCanvas";
import ZoomIndicator from "../components/viewer/ZoomIndicator";
import LoadingOverlay from "../components/viewer/LoadingOverlay";
import ErrorMessage from "../components/viewer/ErrorMessage";
import ScreenAlert from "../components/viewer/ScreenAlert";
import Controls from "../components/controls/Controls";
import Sidebar from "../components/sidebar/Sidebar";

const ViewerPage = () => {
  const { mountRef, meshRef, zoomLevel, resetCamera, handlePan, replaceModel } =
    useThreeScene();
  const { loadingProgress, error, modelTexture, stats, handleFileUpload } =
    useModelLoader(replaceModel);
  const { viewMode, setViewMode } = useViewMode(meshRef, modelTexture);
  const { handleMouseDown, isDragging, isPanning } = useRotation(
    meshRef,
    handlePan,
  );
  const { isSmallScreen, screenWidth } = useScreenSize(1250);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-gray-900 text-white">
      <div className="relative flex-1 overflow-hidden">
        <ViewerCanvas
          mountRef={mountRef}
          onMouseDown={handleMouseDown}
          isDragging={isDragging}
          isPanning={isPanning}
        />
        <LoadingOverlay loadingProgress={loadingProgress} />
        <div
          className={`z-50 transition-all duration-500 ${
            isSmallScreen ? "opacity-100" : "opacity-0"
          }`}
        >
          <ScreenAlert isSmallScreen={isSmallScreen} screenWidth={screenWidth} />
        </div>
        <ErrorMessage error={error} />
        <Controls onReset={resetCamera} />
        {loadingProgress === null && !error && (
          <ZoomIndicator zoomLevel={zoomLevel} />
        )}
      </div>
      <Sidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        stats={stats}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default ViewerPage;
