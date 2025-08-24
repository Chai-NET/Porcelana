import React, { useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { TDSpace } from "../hooks/3D_space.jsx";
import { createMaterial } from "../components/3d-viewer/utils/materials.js";
import Controls from "../components/3d-viewer/Controls.jsx";
import SidePanel from "../components/3d-viewer/SidePanel/sidePanel.jsx";
import Loading from "../components/3d-viewer/Loading.jsx";
import ErrorMessage from "../components/3d-viewer/ErrorMessage.jsx";
import ZoomIndicator from "../components/3d-viewer/ZoomIndicator.jsx";
import ScreenAlert from "../components/3d-viewer/ScreenAlert.jsx";

const FALLBACK_TEXTURE_URL =
  "https://threejs.org/examples/textures/uv_grid_opengl.jpg";

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("basecolor");
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [modelTexture, setModelTexture] = useState(null);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 1250) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    mountRef,
    meshRef,
    stats,
    setStats,
    zoomLevel,
    resetCamera,
    replaceModel,
  } = TDSpace();

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !meshRef.current) return;

      const deltaX = (e.clientX - lastMousePos.x) * 0.01;
      const deltaY = (e.clientY - lastMousePos.y) * 0.01;

      meshRef.current.rotation.y += deltaX;
      meshRef.current.rotation.x += deltaY;

      setLastMousePos({ x: e.clientX, y: e.clientY });
    },
    [isDragging, lastMousePos],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (!meshRef.current) return;

    const applyMaterial = (object, material) => {
      if (object.isMesh) {
        if (
          ["wireframe", "normals", "matcap", "basecolor", "texture"].includes(
            viewMode,
          )
        ) {
          if (object.material && object.material.dispose)
            object.material.dispose();
          object.material = createMaterial(
            viewMode,
            object.geometry,
            viewMode === "texture" ? modelTexture : undefined,
          );
        }
      }
      if (object.children) {
        object.children.forEach((child) => applyMaterial(child, material));
      }
    };

    applyMaterial(
      meshRef.current,
      createMaterial(
        viewMode,
        meshRef.current.geometry,
        viewMode === "texture" ? modelTexture : undefined,
      ),
    );
  }, [viewMode, modelTexture]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = file.name;
    const fileSize = file.size; // in bytes
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

    // Initialize material analysis object
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
          // Replace the current model with the uploaded
          const model = gltf.scene;
          replaceModel(model);

          let foundTexture = null;
          const materials = new Set();

          // Analyze materials and textures
          model.traverse((child) => {
            if (child.isMesh && child.material) {
              const material = child.material;
              materials.add(material);

              // Check for textures
              if (material.map) {
                foundTexture = material.map;
                materialAnalysis.hasTextures = true;
                if (!materialAnalysis.textureTypes.includes("diffuse/albedo")) {
                  materialAnalysis.textureTypes.push("diffuse/albedo");
                }
              }

              // Check: PBR properties
              if (
                material.isMeshStandardMaterial ||
                material.isMeshPhysicalMaterial
              ) {
                materialAnalysis.hasPBR = true;

                // Check:PBR texture maps
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
            // Load fallback texture if none found
            const fallback = new THREE.TextureLoader().load(
              FALLBACK_TEXTURE_URL,
            );
            setModelTexture(fallback);
          }

          // Compute geometry stats
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

          // Get bounding box for model dimensions
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

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-gray-900 text-white">
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={mountRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        />
        <Loading isLoading={isLoading} />

        <div
          className={`z-50 transition-all duration-500 ${isSmallScreen ? "opacity-100" : "opacity-0"}`}
        >
          <ScreenAlert isSmallScreen={isSmallScreen} />
        </div>
        <ErrorMessage error={error} />
        <Controls onReset={resetCamera} />

        {!isLoading && !error && <ZoomIndicator zoomLevel={zoomLevel} />}
      </div>
      <SidePanel
        viewMode={viewMode}
        setViewMode={setViewMode}
        stats={stats}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default MainPage;
