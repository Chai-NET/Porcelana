import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { Upload, RotateCcw, Eye } from "lucide-react";

const ThreeDObjectViewer = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const controlsRef = useRef(null);
  const frameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("basecolor");
  const [stats, setStats] = useState({ triangles: 0, vertices: 0, format: "" });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Add default geometry (cube)
    const geometry = new THREE.BoxGeometry(3, 3, 3);
    const material = new THREE.MeshLambertMaterial({ color: 0x252525 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Update stats for default cube
    setStats({
      triangles: geometry.attributes.position.count / 3,
      vertices: geometry.attributes.position.count,
      format: "Default Cube",
    });

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight,
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

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

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Create materials for different view modes
  const createMaterial = (mode, geometry) => {
    switch (mode) {
      case "wireframe":
        return new THREE.MeshBasicMaterial({
          color: 0x0000ff,
          wireframe: true,
        });

      case "matcap":
        // Create a simple matcap-like material
        return new THREE.MeshMatcapMaterial({
          color: 0x888888,
          matcap: createMatcapTexture(),
        });

      case "basecolor":
        return new THREE.MeshLambertMaterial({
          color: 0x00aa88,
        });

      case "normals":
        return new THREE.MeshNormalMaterial();

      default:
        return new THREE.MeshLambertMaterial({ color: 0x00aa88 });
    }
  };

  // Create a simple matcap texture
  const createMatcapTexture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, "#888888");
    gradient.addColorStop(1, "#333333");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Update material based on view mode
  useEffect(() => {
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

      // For demo purposes, we'll create different geometries based on file extension
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

  // Format numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* 3D Viewer */}
      <div className="relative flex-1">
        <div
          ref={mountRef}
          className="h-full w-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-xl">Loading 3D model...</div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute top-4 left-4 rounded bg-red-600 px-4 py-2">
            {error}
          </div>
        )}

        {/* Controls overlay */}
        <div className="fixed top-4 right-4 flex gap-2">
          <button
            onClick={resetCamera}
            className="rounded bg-gray-700 p-2 transition-colors hover:bg-gray-600"
            title="Reset Camera"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Side Panel */}
      <div className="fixed flex h-dvh w-80 flex-col bg-gray-800 p-6">
        <h2 className="text-3xl font-bold">Porcelana</h2>
        <h3 className="mb-6 text-sm font-light">3D Object Viewer</h3>
        {/* File Upload */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">
            Upload 3D Model
          </label>
          <label className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-600 transition-colors hover:border-gray-500">
            <div className="text-center">
              <Upload className="mx-auto mb-2" size={24} />
              <span className="text-sm text-gray-300">
                Drop file here or click to browse
              </span>
              <div className="mt-1 text-xs text-gray-400">
                Supports OBJ, FBX, GLTF, GLB
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".obj,.fbx,.gltf,.glb"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* View Mode Controls */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium">View Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "wireframe", label: "Wireframe" },
              { key: "matcap", label: "Matcap" },
              { key: "basecolor", label: "Base Color" },
              { key: "normals", label: "Vertex Normals" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`rounded p-3 text-left transition-colors ${
                  viewMode === key
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <Eye size={16} className="mr-2 inline" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Model Statistics */}
        <div className="rounded-lg bg-gray-700 p-4">
          <h3 className="mb-3 text-lg font-semibold">Model Info</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Format:</span>
              <span className="font-mono text-blue-400">
                {stats.format || "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Triangles:</span>
              <span className="text-xl font-bold">
                {formatNumber(stats.triangles)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Vertices:</span>
              <span className="text-xl font-bold">
                {formatNumber(stats.vertices)}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-gray-400">
          <h4 className="mb-2 font-semibold">Controls:</h4>
          <ul className="list-disc space-y-1 pl-3 text-sm">
            <li>Click and drag to rotate</li>
            <li>Use view modes to inspect model</li>
            <li>Upload your own 3D files</li>
            <li>Reset camera with button</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThreeDObjectViewer;
