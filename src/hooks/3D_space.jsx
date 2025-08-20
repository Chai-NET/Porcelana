import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { createMaterial } from "../components/3d-viewer/utils/materials";

export const TDSpace = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const frameRef = useRef(null);
  const controlsRef = useRef({
    isZooming: false,
    initialDistance: 5,
    currentDistance: 5,
    minDistance: 2.5, //
    maxDistance: 10, //
  });

  const [stats, setStats] = useState({ triangles: 0, vertices: 0, format: "" });
  const [zoomLevel, setZoomLevel] = useState(100); // 100% = no zoom, 200% = 2x zoom
  const [isDefaultCube, setIsDefaultCube] = useState(true);

  const calculateZoomPercentage = useCallback((distance) => {
    const { minDistance, initialDistance } = controlsRef.current;
    const zoomFactor = initialDistance / distance;
    return Math.round(Math.max(100, Math.min(200, zoomFactor * 100)));
  }, []);

  // Center and scale model to fit in view
  const centerAndScaleModel = useCallback((object) => {
    if (!object) return;

    // Create bounding box
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Center the object
    object.position.sub(center);

    // Scale to fit in view (3)
    const maxDimension = Math.max(size.x, size.y, size.z);
    if (maxDimension > 0) {
      const targetSize = 3.5;
      const scaleFactor = targetSize / maxDimension;
      object.scale.setScalar(scaleFactor);
    }

    // Reset rotation to show model according to 3D space
    object.rotation.set(0, 0, 0);
  }, []);

  // Handle wheel zoom
  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();

      const { minDistance, maxDistance } = controlsRef.current;
      const zoomSpeed = 0.1;
      const delta = event.deltaY * 0.001 * zoomSpeed;

      // Update camera distance
      const newDistance = Math.max(
        minDistance,
        Math.min(maxDistance, controlsRef.current.currentDistance + delta),
      );

      controlsRef.current.currentDistance = newDistance;

      if (cameraRef.current) {
        cameraRef.current.position.setLength(newDistance);
        setZoomLevel(calculateZoomPercentage(newDistance));
      }
    },
    [calculateZoomPercentage],
  );

  // Initialize the 3D scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282424);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, controlsRef.current.initialDistance);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    const updateSize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    renderer.domElement.style.display = "block";
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);
    updateSize();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Default geometry (cube)
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = createMaterial("basecolor", geometry);
    const mesh = new THREE.Mesh(geometry, material);

    // Center the default cube
    centerAndScaleModel(mesh);
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

      // Auto-rotate the default cube
      if (meshRef.current && isDefaultCube) {
        meshRef.current.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Event listeners
    const canvas = renderer.domElement;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", updateSize);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", updateSize);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  // Reset camera position
  const resetCamera = useCallback(() => {
    if (cameraRef.current && meshRef.current) {
      controlsRef.current.currentDistance = controlsRef.current.initialDistance;
      cameraRef.current.position.set(0, 0, controlsRef.current.initialDistance);
      cameraRef.current.lookAt(0, 0, 0);
      setZoomLevel(100);
    }
  }, []);

  // Replace the current model with uploaded.
  const replaceModel = useCallback(
    (newModel) => {
      if (!sceneRef.current || !newModel) return;

      // Remove current model
      if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);

        // Dispose of old model resources
        meshRef.current.traverse((child) => {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                if (mat.normalMap) mat.normalMap.dispose();
                if (mat.roughnessMap) mat.roughnessMap.dispose();
                if (mat.metalnessMap) mat.metalnessMap.dispose();
                mat.dispose();
              });
            } else {
              if (child.material.map) child.material.map.dispose();
              if (child.material.normalMap) child.material.normalMap.dispose();
              if (child.material.roughnessMap)
                child.material.roughnessMap.dispose();
              if (child.material.metalnessMap)
                child.material.metalnessMap.dispose();
              child.material.dispose();
            }
          }
        });
      }

      sceneRef.current.add(newModel);
      meshRef.current = newModel;

      // Auto-rotation boolean
      setIsDefaultCube(false);

      // Centering and scaling
      centerAndScaleModel(newModel);
      resetCamera();
    },
    [centerAndScaleModel, resetCamera],
  );

  return {
    mountRef,
    sceneRef,
    cameraRef,
    meshRef,
    stats,
    setStats,
    zoomLevel,
    resetCamera,
    replaceModel,
    setIsDefaultCube,
  };
};
