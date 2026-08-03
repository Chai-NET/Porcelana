import { useCallback } from "react";
import { useThreeScene } from "@/entities/scene";
import { useModelLoader } from "@/features/load-model";
import { useViewMode, DEFAULT_VIEW_MODE } from "@/features/switch-view-mode";
import { useModelInteraction } from "@/features/rotate-model";
import { useKeyboardMovement } from "@/features/move-camera";
import { useSceneLighting } from "@/features/scene-lighting";
import { useOptionsMenu, ViewerOptionsMenu } from "@/features/viewer-options";
import { ViewerStage } from "@/widgets/viewer-stage";
import { ViewerToolbar } from "@/widgets/viewer-toolbar";
import { ModelSidebar } from "@/widgets/model-sidebar";

const ViewerPage = () => {
  const {
    mountRef,
    sceneRef,
    meshRef,
    originalMaterialsRef,
    zoomLevel,
    resetCamera,
    handlePan,
    handleZoom,
    replaceModel,
    resetToPlaceholder,
    isTurntableActive,
    toggleTurntable,
    resetTurntable,
    turntableSpeed,
    startTurntableAt,
    isZoomUnlocked,
    zoomBlockedCount,
    toggleZoomLock,
    resetZoomLock,
  } = useThreeScene();

  const {
    loadingProgress,
    error,
    modelTexture,
    stats,
    loadFile,
    loadPresetAsset,
    reset: resetLoader,
  } = useModelLoader(replaceModel);

  const { viewMode, setViewMode } = useViewMode(
    meshRef,
    modelTexture,
    originalMaterialsRef,
  );

  const optionsMenu = useOptionsMenu();
  const interaction = useModelInteraction(meshRef, handlePan, optionsMenu.open);
  useKeyboardMovement(handlePan, handleZoom);
  const { isLightOn, toggleLight, turnLightOff } = useSceneLighting(sceneRef);

  /** Back to a fresh session: placeholder cube, home camera, defaults. */
  const resetViewer = useCallback(() => {
    resetTurntable();
    resetZoomLock();
    turnLightOff();
    resetToPlaceholder();
    resetLoader();
    setViewMode(DEFAULT_VIEW_MODE);
  }, [
    resetTurntable,
    resetZoomLock,
    turnLightOff,
    resetToPlaceholder,
    resetLoader,
    setViewMode,
  ]);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-gray-900 text-white">
      <ViewerStage
        mountRef={mountRef}
        interaction={interaction}
        loadingProgress={loadingProgress}
        error={error}
        zoomLevel={zoomLevel}
        isZoomUnlocked={isZoomUnlocked}
        zoomBlockedCount={zoomBlockedCount}
        onToggleZoomLock={toggleZoomLock}
      >
        <ViewerToolbar
          onReset={resetCamera}
          onSelectAsset={loadPresetAsset}
          isLoading={loadingProgress !== null}
        />
        {optionsMenu.position && (
          <ViewerOptionsMenu
            position={optionsMenu.position}
            onClose={optionsMenu.close}
            onResetViewer={resetViewer}
            onRepositionCamera={resetCamera}
            isTurntableActive={isTurntableActive}
            onToggleTurntable={toggleTurntable}
            turntableSpeed={turntableSpeed}
            onSelectTurntableSpeed={startTurntableAt}
            isLightOn={isLightOn}
            onToggleLight={toggleLight}
          />
        )}
      </ViewerStage>

      <ModelSidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        stats={stats}
        onSelectFile={loadFile}
      />
    </div>
  );
};

export default ViewerPage;
