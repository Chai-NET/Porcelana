/**
 * Factor applied to rotation, zoom and keyboard movement while Shift is held.
 * Shared because the drag, wheel and WASD handlers live in different slices
 * but must slow down by the same amount.
 */
export const PRECISION_MODIFIER = 0.25;
