/**
 * Design tokens that both CSS and Three.js need.
 *
 * The CSS side lives in the `@theme` block of app/styles/index.css; these are
 * its numeric twins for materials, lights and the scene background. Change a
 * value here and in the stylesheet together.
 */
export const SCENE_BACKGROUND_COLOR = 0x282424; // --color-bg
export const ACCENT_COLOR = 0x869fef; // --color-accent

/** Below this viewport width the layout is cramped and the user is warned. */
export const MIN_SUPPORTED_WIDTH = 1250;
