import { useRef, useEffect, useCallback } from "react";
import {
  collectMaterials,
  collectSubtreeResources,
  disposeMaterial,
} from "@/shared/lib/three/dispose";
import { PRECISION_MODIFIER } from "@/shared/config/controls";
import {
  IDLE_ROTATION_SPEED,
  TURNTABLE_ROTATION_SPEED,
  ZOOM_SPEED_PER_PIXEL,
} from "../config/scene";
import { createCamera, createRenderer, createScene } from "../lib/sceneFactory";
import {
  createCenteredPivot,
  createPlaceholderModel,
} from "../lib/normalizeModel";
import { normalizeWheelDelta } from "../lib/zoom";
import { useCameraRig } from "./useCameraRig";
import { useTurntable } from "./useTurntable";

/**
 * Owns the renderer, the scene graph and the model currently mounted in it.
 *
 * Mutable scene facts live in refs, not state: re-running the setup effect would
 * tear down and rebuild the whole scene, so its dependency array must stay
 * limited to stable callbacks (and stable refs).
 */
export const useThreeScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const frameRef = useRef(null);
  const isPlaceholderRef = useRef(true);
  const originalMaterialsRef = useRef(new Map());

  const { zoomLevel, zoomBy, panBy, syncCamera, resetCamera } =
    useCameraRig(cameraRef);

  const {
    isActiveRef: turntableActiveRef,
    isActive: isTurntableActive,
    toggle: toggleTurntable,
    stop: stopTurntable,
  } = useTurntable();

  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();
      const speed = event.shiftKey
        ? ZOOM_SPEED_PER_PIXEL * PRECISION_MODIFIER
        : ZOOM_SPEED_PER_PIXEL;
      zoomBy(normalizeWheelDelta(event) * speed);
    },
    [zoomBy],
  );

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const originalMaterials = originalMaterialsRef.current;

    const scene = createScene();
    const camera = createCamera();
    const renderer = createRenderer();

    sceneRef.current = scene;
    cameraRef.current = camera;
    syncCamera();

    const updateSize = () => {
      const { width, height } = mount.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      syncCamera();
    };

    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);
    updateSize();
    setTimeout(updateSize, 100);

    const placeholder = createPlaceholderModel();
    scene.add(placeholder);
    meshRef.current = placeholder;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const mesh = meshRef.current;
      if (mesh && isPlaceholderRef.current) {
        mesh.rotation.y += IDLE_ROTATION_SPEED;
      } else if (mesh && turntableActiveRef.current) {
        mesh.rotation.y += TURNTABLE_ROTATION_SPEED;
      }
      renderer.render(scene, camera);
    };
    animate();

    const canvas = renderer.domElement;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", updateSize);

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(mount);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", updateSize);
      resizeObserver.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      canvas.parentNode?.removeChild(canvas);
      renderer.dispose();

      const stale = new Set();
      originalMaterials.forEach((mat) => collectMaterials(mat, stale));
      collectSubtreeResources(scene, stale);
      stale.forEach(disposeMaterial);
      originalMaterials.clear();
    };
  }, [handleWheel, syncCamera, turntableActiveRef]);

  /** Removes the mounted model and disposes everything it held. */
  const disposeCurrentModel = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene || !meshRef.current) return;

    scene.remove(meshRef.current);

    const stale = new Set();
    originalMaterialsRef.current.forEach((mat) => collectMaterials(mat, stale));
    collectSubtreeResources(meshRef.current, stale);
    stale.forEach(disposeMaterial);
    originalMaterialsRef.current.clear();
    meshRef.current = null;
  }, []);

  /**
   * Swaps in a freshly loaded model, disposing everything the previous one held.
   *
   * The authored materials are stashed here, synchronously, before returning:
   * this runs inside the loader callback while useViewMode's effect only runs
   * after the next render, so anything not captured now is overwritten before
   * a reference to it exists.
   */
  const replaceModel = useCallback(
    (model) => {
      const scene = sceneRef.current;
      if (!scene || !model) return;

      disposeCurrentModel();

      const pivot = createCenteredPivot(model);
      pivot.traverse((child) => {
        if (child.isMesh && child.material) {
          originalMaterialsRef.current.set(child, child.material);
        }
      });

      scene.add(pivot);
      meshRef.current = pivot;
      isPlaceholderRef.current = false;
      resetCamera();
    },
    [disposeCurrentModel, resetCamera],
  );

  /** Returns the stage to its initial state: placeholder cube, camera home. */
  const resetToPlaceholder = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    disposeCurrentModel();

    const placeholder = createPlaceholderModel();
    scene.add(placeholder);
    meshRef.current = placeholder;
    isPlaceholderRef.current = true;
    resetCamera();
  }, [disposeCurrentModel, resetCamera]);

  return {
    mountRef,
    sceneRef,
    cameraRef,
    meshRef,
    originalMaterialsRef,
    zoomLevel,
    resetCamera,
    handlePan: panBy,
    handleZoom: zoomBy,
    replaceModel,
    resetToPlaceholder,
    isTurntableActive,
    toggleTurntable,
    stopTurntable,
  };
};
