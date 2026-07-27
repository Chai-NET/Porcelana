import { CAMERA } from "../config/scene";

export const clampDistance = (distance) =>
  Math.min(CAMERA.maxDistance, Math.max(CAMERA.minDistance, distance));

/**
 * Camera distance → the percentage shown in the zoom indicator.
 *
 * The scale is anchored on the three distances the camera can actually reach,
 * so the readout always matches what the viewport shows:
 *
 *   maxDistance (fully zoomed out) →   0%
 *   initialDistance (reset / fresh load) → 100%
 *   minDistance (fully zoomed in)  → 200%
 *
 * Linear on each side of the anchor, which keeps the indicator's progress bar
 * proportional to how much zoom range is left in either direction.
 */
export const distanceToZoomPercent = (distance) => {
  const { minDistance, initialDistance, maxDistance } = CAMERA;
  const clamped = clampDistance(distance);

  const percent =
    clamped > initialDistance
      ? (100 * (maxDistance - clamped)) / (maxDistance - initialDistance)
      : 100 +
        (100 * (initialDistance - clamped)) / (initialDistance - minDistance);

  return Math.round(percent);
};

/** The zoom percentage a freshly loaded or reset camera reports. */
export const DEFAULT_ZOOM_PERCENT = distanceToZoomPercent(
  CAMERA.initialDistance,
);

export const MAX_ZOOM_PERCENT = distanceToZoomPercent(CAMERA.minDistance);

const DELTA_MODE_SCALE = {
  0: 1, // already pixels
  1: 16, // lines → px (Firefox)
  2: 800, // pages → px
};

/**
 * Wheel events report deltas in pixels, lines or pages depending on browser and
 * input device; normalizing to pixels keeps zoom speed device-independent.
 * Some browsers move the delta onto the X axis while Shift is held.
 */
export const normalizeWheelDelta = (event) => {
  const delta =
    event.deltaY !== 0 ? event.deltaY : event.shiftKey ? event.deltaX : 0;
  return delta * (DELTA_MODE_SCALE[event.deltaMode] ?? 1);
};
