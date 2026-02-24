import { useState, useEffect } from "react";
import { createMaterial } from "../lib/materials";

export const useViewMode = (meshRef, modelTexture) => {
  const [viewMode, setViewMode] = useState("basecolor");

  useEffect(() => {
    if (!meshRef.current) return;

    const applyMaterial = (object) => {
      if (object.isMesh) {
        if (object.material?.dispose) object.material.dispose();
        object.material = createMaterial(
          viewMode,
          object.geometry,
          viewMode === "texture" ? modelTexture : undefined,
        );
      }
      object.children?.forEach(applyMaterial);
    };

    applyMaterial(meshRef.current);
  }, [viewMode, modelTexture]);

  return { viewMode, setViewMode };
};
