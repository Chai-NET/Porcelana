/** Camera distances, in scene units, along the fixed +Z axis. */
export const CAMERA = {
  fov: 75,
  near: 0.1,
  far: 1000,
  /** Distance the camera returns to on reset — the 100% zoom anchor. */
  initialDistance: 5,
  /** Closest the camera may get — 200% zoom. */
  minDistance: 2.5,
  /** Farthest the camera may get — 0% zoom. */
  maxDistance: 10,
};

/** Every model is uniformly scaled so its largest dimension is this many units. */
export const NORMALIZED_MODEL_SIZE = 3.5;

/** Pan is scaled by distance so it feels the same at any zoom. */
export const PAN_SPEED_PER_UNIT = 0.001;

/** Scene units of camera travel per normalized pixel of wheel movement. */
export const ZOOM_SPEED_PER_PIXEL = 0.005;

/** Radians per frame the placeholder model spins while idle. */
export const IDLE_ROTATION_SPEED = 0.003;
