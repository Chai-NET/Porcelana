import { useRef, useState, useCallback, useEffect } from "react";
import { CAMERA, PAN_SPEED_PER_UNIT } from "../config/scene";
import {
  clampDistance,
  distanceToZoomPercent,
  DEFAULT_ZOOM_PERCENT,
} from "../lib/zoom";
import { useZoomLock } from "./useZoomLock";

export const useCameraRig = (cameraRef) => {
  const panOffsetRef = useRef({ x: 0, y: 0 });
  const distanceRef = useRef(CAMERA.initialDistance);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM_PERCENT);

  const zoomLock = useZoomLock();
  const { isUnlocked, isUnlockedRef, reportBlocked } = zoomLock;

  const syncCamera = useCallback(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    const { x, y } = panOffsetRef.current;
    camera.position.set(x, y, distanceRef.current);
    camera.lookAt(x, y, 0);
  }, [cameraRef]);

  /** Moves the camera to `distance` and republishes the readout. */
  const applyDistance = useCallback(
    (distance) => {
      distanceRef.current = distance;
      syncCamera();
      setZoomLevel(distanceToZoomPercent(distance));
    },
    [syncCamera],
  );

  const zoomBy = useCallback(
    (delta) => {
      const requested = distanceRef.current + delta;
      const next = clampDistance(requested, isUnlockedRef.current);

      if (requested < next) reportBlocked();
      applyDistance(next);
    },
    [applyDistance, isUnlockedRef, reportBlocked],
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
    applyDistance(CAMERA.initialDistance);
  }, [applyDistance]);

  useEffect(() => {
    if (isUnlocked || distanceRef.current >= CAMERA.minDistance) return;
    applyDistance(CAMERA.minDistance);
  }, [isUnlocked, applyDistance]);

  return { zoomLevel, zoomBy, panBy, syncCamera, resetCamera, zoomLock };
};
