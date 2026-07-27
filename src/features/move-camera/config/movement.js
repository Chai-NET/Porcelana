/** Keys the movement loop listens for: W/S dolly, A/D strafe. */
export const MOVEMENT_KEYS = ["w", "a", "s", "d"];

/**
 * Pixel-equivalent pan applied each frame a strafe key is held — fed through
 * the same distance-scaled pan as mouse dragging, so it feels the same at any
 * zoom.
 */
export const KEYBOARD_PAN_STEP_PX = 8;

/** Scene units the camera dollies each frame W or S is held. */
export const KEYBOARD_DOLLY_STEP = 0.04;
