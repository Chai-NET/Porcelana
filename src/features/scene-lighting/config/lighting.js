/**
 * Spotlight hung above the model, aimed at the origin every model is
 * normalized onto. Intensity is in candela — three.js uses physical light
 * units, so it must be far larger than the scene's directional intensities.
 */
export const SPOTLIGHT = {
  color: 0xffffff,
  intensity: 80,
  position: { x: 0, y: 6, z: 1.5 },
  angle: Math.PI / 5,
  penumbra: 0.4,
  decay: 1.5,
  /** 0 = no distance cutoff. */
  distance: 0,
};
