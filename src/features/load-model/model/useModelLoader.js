import { useState, useCallback } from "react";
import * as THREE from "three";
import { analyzeModel } from "@/entities/model";
import { FALLBACK_TEXTURE_URL } from "@/shared/config/texture";
import { describeFile, hasSupportedExtension } from "../lib/describeFile";

const PLACEHOLDER_STATS = {
  triangles: 8,
  vertices: 24,
  format: "Default Cube",
};

/**
 * Loads a model into the scene and derives the stats shown beside it.
 *
 * Every source funnels into one private `loadFromUrl`: GLTFLoader streams
 * straight from the URL, so a bundled asset is never copied into a Blob first
 * and `cleanup` (revoking an object URL) is simply absent for it. Adding a
 * source means adding another thin entry point, not a second loading path.
 */
export const useModelLoader = (replaceModel) => {
  const [loadingProgress, setLoadingProgress] = useState(null); // null = idle, 0–100 = loading
  const [error, setError] = useState("");
  const [modelTexture, setModelTexture] = useState(null);
  const [stats, setStats] = useState(PLACEHOLDER_STATS);

  const loadFromUrl = useCallback(
    async (url, { fileName, fileSize }, cleanup) => {
      const fileDetails = describeFile(fileName, fileSize);

      setLoadingProgress(0);
      setError("");
      setStats((prev) => ({ ...prev, ...fileDetails }));

      try {
        // Kept out of the initial bundle — preserve the dynamic import.
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );

        new GLTFLoader().load(
          url,
          (gltf) => {
            const model = gltf.scene;
            replaceModel(model);

            const { texture, ...modelStats } = analyzeModel(model);
            setModelTexture(
              texture ?? new THREE.TextureLoader().load(FALLBACK_TEXTURE_URL),
            );
            setStats({ ...modelStats, ...fileDetails });
            setLoadingProgress(null);
            cleanup?.();
          },
          (xhr) => {
            if (xhr.total > 0) {
              setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
            }
          },
          (err) => {
            setError("Failed to load GLB model. Please try a different file.");
            setLoadingProgress(null);
            cleanup?.();
            console.error("Error loading GLB:", err);
          },
        );
      } catch (err) {
        setError("Failed to load 3D model. Please try a different file.");
        setLoadingProgress(null);
        cleanup?.();
        console.error("Error loading file:", err);
      }
    },
    [replaceModel],
  );

  /** Entry point for a user-provided File (picker or drag-and-drop). */
  const loadFile = useCallback(
    (file) => {
      if (!file) return;

      if (!hasSupportedExtension(file.name)) {
        setError("Only .glb files are supported.");
        return;
      }

      const url = URL.createObjectURL(file);
      loadFromUrl(url, { fileName: file.name, fileSize: file.size }, () =>
        URL.revokeObjectURL(url),
      );
    },
    [loadFromUrl],
  );

  /** Entry point for a bundled catalog asset. */
  const loadPresetAsset = useCallback(
    (asset) =>
      loadFromUrl(asset.url, {
        fileName: asset.fileName,
        fileSize: asset.fileSize,
      }),
    [loadFromUrl],
  );

  return {
    loadingProgress,
    error,
    modelTexture,
    stats,
    loadFile,
    loadPresetAsset,
  };
};
