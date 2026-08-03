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

export const useThreeScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const frameRef = useRef(null);
  const isPlaceholderRef = useRef(true);
  const originalMaterialsRef = useRef(new Map());

  const { zoomLevel, zoomBy, panBy, syncCamera, resetCamera, zoomLock } =
    useCameraRig(cameraRef);

  const {
    isActiveRef: turntableActiveRef,
    isActive: isTurntableActive,
    toggle: toggleTurntable,
    reset: resetTurntable,
    speedRef: turntableSpeedRef,
    speed: turntableSpeed,
    startAt: startTurntableAt,
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
      if (mesh && turntableActiveRef.current) {
        const baseSpeed = isPlaceholderRef.current
          ? IDLE_ROTATION_SPEED
          : TURNTABLE_ROTATION_SPEED;
        mesh.rotation.y += baseSpeed * turntableSpeedRef.current;
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
  }, [handleWheel, syncCamera, turntableActiveRef, turntableSpeedRef]);

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
    resetTurntable,
    turntableSpeed,
    startTurntableAt,
    isZoomUnlocked: zoomLock.isUnlocked,
    zoomBlockedCount: zoomLock.blockedCount,
    toggleZoomLock: zoomLock.toggle,
    resetZoomLock: zoomLock.reset,
  };
};
