import * as THREE from "three";

const PBR_MAP_LABELS = {
  normalMap: "normal",
  roughnessMap: "roughness",
  metalnessMap: "metalness",
  aoMap: "ambient occlusion",
  emissiveMap: "emissive",
  bumpMap: "bump",
  displacementMap: "displacement",
};

const hasAnyTexture = (mat) =>
  !!(
    mat.map ||
    mat.normalMap ||
    mat.roughnessMap ||
    mat.metalnessMap ||
    mat.aoMap ||
    mat.emissiveMap
  );

export const analyzeModel = (model) => {
  const materialAnalysis = {
    hasPBR: false,
    hasTextures: false,
    textureTypes: [],
    materialCount: 0,
    materials: [],
  };

  const addTextureType = (label) => {
    if (!materialAnalysis.textureTypes.includes(label)) {
      materialAnalysis.textureTypes.push(label);
    }
  };

  const uniqueMaterials = new Set();
  let texture = null;
  let triangles = 0;
  let vertices = 0;
  let meshCount = 0;

  model.traverse((child) => {
    if (!child.isMesh) return;

    if (child.geometry) {
      meshCount++;
      const position = child.geometry.attributes.position;
      triangles += child.geometry.index
        ? child.geometry.index.count / 3
        : position.count / 3;
      vertices += position.count;
    }

    const mat = child.material;
    if (!mat) return;
    uniqueMaterials.add(mat);

    if (mat.map) {
      texture = mat.map;
      materialAnalysis.hasTextures = true;
      addTextureType("diffuse/albedo");
    }

    if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
      materialAnalysis.hasPBR = true;
      Object.entries(PBR_MAP_LABELS).forEach(([slot, label]) => {
        if (mat[slot]) addTextureType(label);
      });
    }

    materialAnalysis.materials.push({
      name: mat.name || "Unnamed Material",
      type: mat.type,
      isPBR: !!(mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial),
      hasTextures: hasAnyTexture(mat),
      color: mat.color ? `#${mat.color.getHexString()}` : null,
      roughness: mat.roughness ?? null,
      metalness: mat.metalness ?? null,
    });
  });

  materialAnalysis.materialCount = uniqueMaterials.size;

  const size = new THREE.Box3()
    .setFromObject(model)
    .getSize(new THREE.Vector3());

  return {
    texture,
    triangles: Math.floor(triangles),
    vertices,
    meshCount,
    dimensions: {
      width: size.x.toFixed(2),
      height: size.y.toFixed(2),
      depth: size.z.toFixed(2),
    },
    materialAnalysis,
  };
};
