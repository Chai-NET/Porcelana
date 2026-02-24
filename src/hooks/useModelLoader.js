import { useState } from "react";
import * as THREE from "three";

const FALLBACK_TEXTURE_URL =
  "https://threejs.org/examples/textures/uv_grid_opengl.jpg";

export const useModelLoader = (replaceModel) => {
  const [isLoading, setIsLoading] = useState(false);
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

    const fileName = file.name;
    const fileSize = file.size;
    const fileSizeKB = (fileSize / 1024).toFixed(2);
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

    console.log("File info:", {
      name: fileName,
      size: fileSize,
      sizeKB: fileSizeKB + " KB",
      sizeMB: fileSizeMB + " MB",
    });

    setIsLoading(true);
    setError("");

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "glb") {
      setError("Only .glb files are supported.");
      setIsLoading(false);
      return;
    }

    const materialAnalysis = {
      hasPBR: false,
      hasTextures: false,
      textureTypes: [],
      materialCount: 0,
      materials: [],
    };

    setStats((prev) => ({
      ...prev,
      format: `.glb`,
      fileName: fileName,
      fileSize: fileSize,
      fileSizeKB: fileSizeKB,
      fileSizeMB: fileSizeMB,
    }));

    try {
      const module = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const GLTFLoader = module.GLTFLoader;
      const loader = new GLTFLoader();
      const url = URL.createObjectURL(file);

      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          replaceModel(model);

          let foundTexture = null;
          const materials = new Set();

          model.traverse((child) => {
            if (child.isMesh && child.material) {
              const material = child.material;
              materials.add(material);

              if (material.map) {
                foundTexture = material.map;
                materialAnalysis.hasTextures = true;
                if (!materialAnalysis.textureTypes.includes("diffuse/albedo")) {
                  materialAnalysis.textureTypes.push("diffuse/albedo");
                }
              }

              if (
                material.isMeshStandardMaterial ||
                material.isMeshPhysicalMaterial
              ) {
                materialAnalysis.hasPBR = true;

                if (
                  material.normalMap &&
                  !materialAnalysis.textureTypes.includes("normal")
                ) {
                  materialAnalysis.textureTypes.push("normal");
                }
                if (
                  material.roughnessMap &&
                  !materialAnalysis.textureTypes.includes("roughness")
                ) {
                  materialAnalysis.textureTypes.push("roughness");
                }
                if (
                  material.metalnessMap &&
                  !materialAnalysis.textureTypes.includes("metalness")
                ) {
                  materialAnalysis.textureTypes.push("metalness");
                }
                if (
                  material.aoMap &&
                  !materialAnalysis.textureTypes.includes("ambient occlusion")
                ) {
                  materialAnalysis.textureTypes.push("ambient occlusion");
                }
                if (
                  material.emissiveMap &&
                  !materialAnalysis.textureTypes.includes("emissive")
                ) {
                  materialAnalysis.textureTypes.push("emissive");
                }
                if (
                  material.bumpMap &&
                  !materialAnalysis.textureTypes.includes("bump")
                ) {
                  materialAnalysis.textureTypes.push("bump");
                }
                if (
                  material.displacementMap &&
                  !materialAnalysis.textureTypes.includes("displacement")
                ) {
                  materialAnalysis.textureTypes.push("displacement");
                }
              }

              materialAnalysis.materials.push({
                name: material.name || "Unnamed Material",
                type: material.type,
                isPBR:
                  material.isMeshStandardMaterial ||
                  material.isMeshPhysicalMaterial,
                hasTextures: !!(
                  material.map ||
                  material.normalMap ||
                  material.roughnessMap ||
                  material.metalnessMap ||
                  material.aoMap ||
                  material.emissiveMap
                ),
                color: material.color
                  ? `#${material.color.getHexString()}`
                  : null,
                roughness: material.roughness || null,
                metalness: material.metalness || null,
              });
            }
          });

          materialAnalysis.materialCount = materials.size;
          console.log("Material Analysis:", materialAnalysis);

          if (foundTexture) {
            setModelTexture(foundTexture);
          } else {
            const fallback = new THREE.TextureLoader().load(FALLBACK_TEXTURE_URL);
            setModelTexture(fallback);
          }

          let triangles = 0,
            vertices = 0,
            meshCount = 0;

          model.traverse((child) => {
            if (child.isMesh && child.geometry) {
              meshCount++;
              triangles += child.geometry.index
                ? child.geometry.index.count / 3
                : child.geometry.attributes.position.count / 3;
              vertices += child.geometry.attributes.position.count;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const dimensions = {
            width: size.x.toFixed(2),
            height: size.y.toFixed(2),
            depth: size.z.toFixed(2),
          };

          setStats({
            triangles: Math.floor(triangles),
            vertices: vertices,
            meshCount: meshCount,
            format: `.glb`,
            fileName: fileName,
            fileSize: fileSize,
            fileSizeKB: fileSizeKB,
            fileSizeMB: fileSizeMB,
            dimensions: dimensions,
            materialAnalysis: materialAnalysis,
          });

          setIsLoading(false);
          URL.revokeObjectURL(url);
        },
        undefined,
        (err) => {
          setError("Failed to load GLB model. Please try a different file.");
          setIsLoading(false);
          URL.revokeObjectURL(url);
          console.error("Error loading GLB:", err);
        },
      );
    } catch (err) {
      setError("Failed to load 3D model. Please try a different file.");
      setIsLoading(false);
      console.error("Error loading file:", err);
    }
  };

  return { isLoading, error, modelTexture, stats, handleFileUpload };
};
