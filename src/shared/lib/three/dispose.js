const TEXTURE_SLOTS = [
  "map",
  "normalMap",
  "roughnessMap",
  "metalnessMap",
  "aoMap",
  "emissiveMap",
  "bumpMap",
  "displacementMap",
];

export const disposeMaterial = (material) => {
  (Array.isArray(material) ? material : [material]).forEach((mat) => {
    if (!mat) return;
    TEXTURE_SLOTS.forEach((slot) => mat[slot]?.dispose());
    mat.dispose();
  });
};

export const collectMaterials = (source, into) => {
  (Array.isArray(source) ? source : [source]).forEach((mat) => {
    if (mat) into.add(mat);
  });
  return into;
};

export const collectSubtreeResources = (root, into) => {
  root.traverse((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) collectMaterials(object.material, into);
  });
  return into;
};
