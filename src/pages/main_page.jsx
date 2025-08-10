import React, { useState, useCallback } from "react";
import * as THREE from "three";
import { TDSpace } from "../hooks/3D_space.js";
import { createMaterial } from "../components/3d-viewer/utils/materials.js";
import Controls from "../components/3d-viewer/Controls.jsx";
import SidePanel from "../components/3d-viewer/SidePanel/sidePanel.jsx";
import Loading from "../components/3d-viewer/Loading.jsx";
import ErrorMessage from "../components/3d-viewer/ErrorMessage.jsx";

const FALLBACK_TEXTURE_URL =
  "https://threejs.org/examples/textures/uv_grid_opengl.jpg";

const MainPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("basecolor");
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [modelTexture, setModelTexture] = useState(null);

  const { mountRef, sceneRef, cameraRef, meshRef, stats, setStats } = TDSpace();

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

    setIsLoading(true);
    setError("");

    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (fileExtension !== "glb") {
      setError("Only .glb files are supported.");
      setIsLoading(false);
      return;
    }

    setStats((prev) => ({ ...prev, format: `.glb` }));

    try {
      const module = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const GLTFLoader = module.GLTFLoader;
      const loader = new GLTFLoader();
      const url = URL.createObjectURL(file);
      loader.load(
        url,
        (gltf) => {
          // Remove old mesh
          if (meshRef.current) {
            sceneRef.current.remove(meshRef.current);
            if (meshRef.current.geometry) meshRef.current.geometry.dispose();
            if (meshRef.current.material) meshRef.current.material.dispose();
          }
          // Add new mesh (first scene child)
          const model = gltf.scene.children[0];
          sceneRef.current.add(model);
          meshRef.current = model;

          // Extract texture from the model (first mesh with a map)
          let foundTexture = null;
          model.traverse((child) => {
            if (child.isMesh && child.material && child.material.map) {
              foundTexture = child.material.map;
            }
          });
          if (foundTexture) {
            setModelTexture(foundTexture);
          } else {
            // Load fallback texture if none found
            const fallback = new THREE.TextureLoader().load(
              FALLBACK_TEXTURE_URL,
            );
            setModelTexture(fallback);
          }

          // Compute stats
          let triangles = 0,
            vertices = 0;
          model.traverse((child) => {
            if (child.isMesh && child.geometry) {
              triangles += child.geometry.index
                ? child.geometry.index.count / 3
                : child.geometry.attributes.position.count / 3;
              vertices += child.geometry.attributes.position.count;
            }
          });
          setStats({
            triangles: Math.floor(triangles),
            vertices: vertices,
            format: `.glb`,
          });
          URL.revokeObjectURL(url);
        },
        undefined,
        (err) => {
          setError("Failed to load GLB model. Please try a different file.");
          setIsLoading(false);
          URL.revokeObjectURL(url);
        },
      );
    } catch (err) {
      setError("Failed to load 3D model. Please try a different file.");
      console.error("Error loading file:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset camera
  const resetCamera = () => {
    if (cameraRef.current && meshRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      cameraRef.current.lookAt(0, 0, 0);
      meshRef.current.rotation.set(0, 0, 0);
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
        <ErrorMessage error={error} />
        <Controls onReset={resetCamera} />
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
