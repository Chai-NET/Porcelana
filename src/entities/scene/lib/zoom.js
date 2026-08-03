import { CAMERA } from "../config/scene";

export const clampDistance = (distance, isUnlocked = false) => {
  const min = isUnlocked ? CAMERA.unlockedMinDistance : CAMERA.minDistance;
  return Math.min(CAMERA.maxDistance, Math.max(min, distance));
};

const linearZoomPercent = (distance) => {
  const { minDistance, initialDistance, maxDistance } = CAMERA;

  return distance > initialDistance
    ? (100 * (maxDistance - distance)) / (maxDistance - initialDistance)
    : 100 +
        (100 * (initialDistance - distance)) / (initialDistance - minDistance);
};

export const DEFAULT_ZOOM_PERCENT = Math.round(
  linearZoomPercent(CAMERA.initialDistance),
);

export const MAX_ZOOM_PERCENT = Math.round(
  linearZoomPercent(CAMERA.minDistance),
);

export const distanceToZoomPercent = (distance) => {
  const clamped = clampDistance(distance, true);

  return clamped < CAMERA.minDistance
    ? Math.round((MAX_ZOOM_PERCENT * CAMERA.minDistance) / clamped)
    : Math.round(linearZoomPercent(clamped));
};

const DELTA_MODE_SCALE = {
  0: 1, // already pixels
  1: 16, // lines → px (Firefox)
  2: 800, // pages → px
};

export const normalizeWheelDelta = (event) => {
  const delta =
    event.deltaY !== 0 ? event.deltaY : event.shiftKey ? event.deltaX : 0;
  return delta * (DELTA_MODE_SCALE[event.deltaMode] ?? 1);
};
