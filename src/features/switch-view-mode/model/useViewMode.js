import { useState, useEffect } from "react";
import { createMaterial } from "../lib/createMaterial";
import { DEFAULT_VIEW_MODE } from "../config/viewModes";

/**
 * Repaints every mesh in the mounted model whenever the mode or texture changes.
 *
 * An authored material is never disposed here: it has to survive every switch
 * away from Original so it can be restored again. Only generated materials —
 * the ones that differ from the stashed original — are freed.
 */
export const useViewMode = (meshRef, modelTexture, originalMaterialsRef) => {
  const [viewMode, setViewMode] = useState(DEFAULT_VIEW_MODE);

  useEffect(() => {
    if (!meshRef.current) return;
    const originals = originalMaterialsRef.current;

    const applyMaterial = (object) => {
      if (object.isMesh) {
        const original = originals.get(object);

        if (object.material !== original && object.material?.dispose) {
          object.material.dispose();
        }
        object.material =
          viewMode === "original" && original
            ? original
            : createMaterial(
                viewMode,
                object.geometry,
                viewMode === "texture" ? modelTexture : undefined,
              );
      }
      object.children?.forEach(applyMaterial);
    };

    applyMaterial(meshRef.current);
  }, [viewMode, modelTexture, meshRef, originalMaterialsRef]);

  return { viewMode, setViewMode };
};
