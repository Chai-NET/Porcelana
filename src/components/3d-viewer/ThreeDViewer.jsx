import React, { useState, useCallback } from "react";
import * as THREE from "three";
import { useThreeScene } from "../../hooks/useThreeScene";
import { createMaterial } from "./utils/materials";
import Controls from "./Controls";
import SidePanel from "./SidePanel";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

const ThreeDViewer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("basecolor");
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const { mountRef, sceneRef, cameraRef, meshRef, stats, setStats } =
    useThreeScene();

  // Mouse controls for rotation
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

  // Update material based on view mode
  React.useEffect(() => {
    if (!meshRef.current) return;

    const newMaterial = createMaterial(viewMode, meshRef.current.geometry);
    const oldMaterial = meshRef.current.material;
    meshRef.current.material = newMaterial;

    // Dispose old material
    if (oldMaterial && oldMaterial.dispose) {
      oldMaterial.dispose();
    }
  }, [viewMode]);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      setStats((prev) => ({ ...prev, format: `.${fileExtension}` }));

      // different geometries based on file extension
      let geometry;
      switch (fileExtension) {
        case "obj":
          geometry = new THREE.SphereGeometry(2, 32, 32);
          break;
        case "fbx":
          geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 100);
          break;
        case "gltf":
        case "glb":
          geometry = new THREE.IcosahedronGeometry(2, 2);
          break;
        default:
          geometry = new THREE.ConeGeometry(1.5, 3, 12);
      }

      // Remove old mesh
      if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);
        meshRef.current.geometry.dispose();
        meshRef.current.material.dispose();
      }

      // Create new mesh
      const material = createMaterial(viewMode, geometry);
      const mesh = new THREE.Mesh(geometry, material);
      sceneRef.current.add(mesh);
      meshRef.current = mesh;

      // Update stats
      const triangles = geometry.index
        ? geometry.index.count / 3
        : geometry.attributes.position.count / 3;
      const vertices = geometry.attributes.position.count;

      setStats({
        triangles: Math.floor(triangles),
        vertices: vertices,
        format: `.${fileExtension}`,
      });
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

export default ThreeDViewer;
