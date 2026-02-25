import { useState } from "react";
import * as THREE from "three";

const FALLBACK_TEXTURE_URL =
  "https://threejs.org/examples/textures/uv_grid_opengl.jpg";

export const useModelLoader = (replaceModel) => {
  const [loadingProgress, setLoadingProgress] = useState(null); // null = idle, 0–100 = loading
  const [error, setError] = useState("");
  const [modelTexture, setModelTexture] = useState(null);
  const [stats, setStats] = useState({
    triangles: 8,
    vertices: 24,
    format: "Default Cube",
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "glb") {
      setError("Only .glb files are supported.");
      return;
    }

    const fileName = file.name;
    const fileSize = file.size;
    const fileSizeKB = (fileSize / 1024).toFixed(2);
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

    setLoadingProgress(0);
    setError("");

    setStats((prev) => ({
      ...prev,
      format: ".glb",
      fileName,
      fileSize,
      fileSizeKB,
      fileSizeMB,
    }));

    try {
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );
      const loader = new GLTFLoader();
      const url = URL.createObjectURL(file);

      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          replaceModel(model);

          const materialAnalysis = {
            hasPBR: false,
            hasTextures: false,
            textureTypes: [],
            materialCount: 0,
            materials: [],
          };

          let foundTexture = null;
          const materialSet = new Set();

          model.traverse((child) => {
            if (!child.isMesh || !child.material) return;
            const mat = child.material;
            materialSet.add(mat);

            if (mat.map) {
              foundTexture = mat.map;
              materialAnalysis.hasTextures = true;
              if (!materialAnalysis.textureTypes.includes("diffuse/albedo"))
                materialAnalysis.textureTypes.push("diffuse/albedo");
            }

            if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
              materialAnalysis.hasPBR = true;
              const maps = {
                normal: mat.normalMap,
                roughness: mat.roughnessMap,
                metalness: mat.metalnessMap,
                "ambient occlusion": mat.aoMap,
                emissive: mat.emissiveMap,
                bump: mat.bumpMap,
                displacement: mat.displacementMap,
              };
              Object.entries(maps).forEach(([label, tex]) => {
                if (tex && !materialAnalysis.textureTypes.includes(label))
                  materialAnalysis.textureTypes.push(label);
              });
            }

            materialAnalysis.materials.push({
              name: mat.name || "Unnamed Material",
              type: mat.type,
              isPBR: mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial,
              hasTextures: !!(
                mat.map ||
                mat.normalMap ||
                mat.roughnessMap ||
                mat.metalnessMap ||
                mat.aoMap ||
                mat.emissiveMap
              ),
              color: mat.color ? `#${mat.color.getHexString()}` : null,
              roughness: mat.roughness ?? null,
              metalness: mat.metalness ?? null,
            });
          });

          materialAnalysis.materialCount = materialSet.size;

          setModelTexture(
            foundTexture ??
              new THREE.TextureLoader().load(FALLBACK_TEXTURE_URL),
          );

          let triangles = 0,
            vertices = 0,
            meshCount = 0;

          model.traverse((child) => {
            if (!child.isMesh || !child.geometry) return;
            meshCount++;
            triangles += child.geometry.index
              ? child.geometry.index.count / 3
              : child.geometry.attributes.position.count / 3;
            vertices += child.geometry.attributes.position.count;
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());

          setStats({
            triangles: Math.floor(triangles),
            vertices,
            meshCount,
            format: ".glb",
            fileName,
            fileSize,
            fileSizeKB,
            fileSizeMB,
            dimensions: {
              width: size.x.toFixed(2),
              height: size.y.toFixed(2),
              depth: size.z.toFixed(2),
            },
            materialAnalysis,
          });

          setLoadingProgress(null);
          URL.revokeObjectURL(url);
        },
        (xhr) => {
          // xhr.total equals file.size for blob: URLs, so progress is always accurate
          if (xhr.total > 0) {
            setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
          }
        },
        (err) => {
          setError("Failed to load GLB model. Please try a different file.");
          setLoadingProgress(null);
          URL.revokeObjectURL(url);
          console.error("Error loading GLB:", err);
        },
      );
    } catch (err) {
      setError("Failed to load 3D model. Please try a different file.");
      setLoadingProgress(null);
      console.error("Error loading file:", err);
    }
  };

  return { loadingProgress, error, modelTexture, stats, handleFileUpload };
};
