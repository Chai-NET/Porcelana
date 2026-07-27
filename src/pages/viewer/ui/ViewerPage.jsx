import { useThreeScene } from "@/entities/scene";
import { useModelLoader } from "@/features/load-model";
import { useViewMode } from "@/features/switch-view-mode";
import { useModelInteraction } from "@/features/rotate-model";
import { ViewerStage } from "@/widgets/viewer-stage";
import { ViewerToolbar } from "@/widgets/viewer-toolbar";
import { ModelSidebar } from "@/widgets/model-sidebar";

const ViewerPage = () => {
  const {
    mountRef,
    meshRef,
    originalMaterialsRef,
    zoomLevel,
    resetCamera,
    handlePan,
    replaceModel,
  } = useThreeScene();

  const {
    loadingProgress,
    error,
    modelTexture,
    stats,
    loadFile,
    loadPresetAsset,
  } = useModelLoader(replaceModel);

  const { viewMode, setViewMode } = useViewMode(
    meshRef,
    modelTexture,
    originalMaterialsRef,
  );

  const interaction = useModelInteraction(meshRef, handlePan);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-gray-900 text-white">
      <ViewerStage
        mountRef={mountRef}
        interaction={interaction}
        loadingProgress={loadingProgress}
        error={error}
        zoomLevel={zoomLevel}
      >
        <ViewerToolbar
          onReset={resetCamera}
          onSelectAsset={loadPresetAsset}
          isLoading={loadingProgress !== null}
        />
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
