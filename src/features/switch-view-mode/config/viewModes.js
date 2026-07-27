/**
 * The single source of truth for the mode list. Adding a mode means adding an
 * entry here *and* a `case` in lib/createMaterial.js — nothing else knows the
 * list.
 *
 * `requiresModel` marks a mode that has nothing to show until a model is
 * loaded: "original" restores authored materials, and the placeholder has none.
 */
export const VIEW_MODES = [
  { key: "wireframe", label: "Wireframe" },
  { key: "matcap", label: "Matcap" },
  { key: "basecolor", label: "Base" },
  { key: "normals", label: "Normals" },
  { key: "texture", label: "Texture" },
  { key: "original", label: "Original", requiresModel: true },
];

export const DEFAULT_VIEW_MODE = "basecolor";
