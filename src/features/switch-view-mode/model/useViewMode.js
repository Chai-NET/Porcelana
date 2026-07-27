import { useState, useEffect } from "react";
import { createMaterial } from "../lib/createMaterial";
import { DEFAULT_VIEW_MODE } from "../config/viewModes";

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
