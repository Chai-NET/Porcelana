import { useRef, useState, useCallback } from "react";
import { CAMERA, PAN_SPEED_PER_UNIT } from "../config/scene";
import {
  clampDistance,
  distanceToZoomPercent,
  DEFAULT_ZOOM_PERCENT,
} from "../lib/zoom";

/**
 * Owns where the camera sits. There is no OrbitControls: the camera stays
 * axis-aligned at (panX, panY, distance) looking at (panX, panY, 0), and
 * "rotation" turns the model instead.
 *
 * Distance and pan are refs because the render loop reads them every frame and
 * must never see a stale value; only `zoomLevel` is state, because it is the one
 * fact the UI draws.
 */
export const useCameraRig = (cameraRef) => {
  const panOffsetRef = useRef({ x: 0, y: 0 });
  const distanceRef = useRef(CAMERA.initialDistance);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_PERCENT);

  /** Pushes the current distance/pan onto the camera. */
  const syncCamera = useCallback(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const { x, y } = panOffsetRef.current;
    camera.position.set(x, y, distanceRef.current);
    camera.lookAt(x, y, 0);
  }, [cameraRef]);

  /** `delta` is a signed distance change: positive moves the camera away. */
  const zoomBy = useCallback(
    (delta) => {
      distanceRef.current = clampDistance(distanceRef.current + delta);
      syncCamera();
      setZoomLevel(distanceToZoomPercent(distanceRef.current));
    },
    [syncCamera],
  );

  const panBy = useCallback(
    (deltaX, deltaY) => {
      const panSpeed = distanceRef.current * PAN_SPEED_PER_UNIT;
      panOffsetRef.current.x -= deltaX * panSpeed;
      panOffsetRef.current.y += deltaY * panSpeed;
      syncCamera();
    },
    [syncCamera],
  );

  const resetCamera = useCallback(() => {
    panOffsetRef.current = { x: 0, y: 0 };
    distanceRef.current = CAMERA.initialDistance;
    syncCamera();
    setZoomLevel(DEFAULT_ZOOM_PERCENT);
  }, [syncCamera]);

  return { zoomLevel, zoomBy, panBy, syncCamera, resetCamera };
};
