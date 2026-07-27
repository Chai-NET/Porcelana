import { useThreeScene } from "@/entities/scene";
import { useModelLoader } from "@/features/load-model";
import { useViewMode } from "@/features/switch-view-mode";
import { useModelInteraction } from "@/features/rotate-model";
import { ViewerStage } from "@/widgets/viewer-stage";
import { ViewerToolbar } from "@/widgets/viewer-toolbar";
import { ModelSidebar } from "@/widgets/model-sidebar";

/**
 * The only page: it wires the hooks together and lays the widgets out.
 *
 * The hook order is load-bearing — each one consumes what the previous returns:
 * the scene owns the refs, the loader feeds it models, the view mode repaints
 * the mounted model, and the interaction hook drives both mesh and camera.
 */
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
