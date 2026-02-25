import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { createMaterial } from "../lib/materials";

export const useThreeScene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const frameRef = useRef(null);
  const isDefaultCubeRef = useRef(true); // ref — changing it won't re-run the scene effect
  const panOffsetRef = useRef({ x: 0, y: 0 });
  const controlsRef = useRef({
    initialDistance: 5,
    currentDistance: 5,
    minDistance: 2.5,
    maxDistance: 10,
  });

  const [zoomLevel, setZoomLevel] = useState(100);

  const calculateZoomPercentage = useCallback((distance) => {
    const { initialDistance } = controlsRef.current;
    const zoomFactor = initialDistance / distance;
    return Math.round(Math.max(100, Math.min(200, zoomFactor * 100)));
  }, []);

  const centerAndScaleModel = useCallback((object) => {
    if (!object) return;

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);
    if (maxDimension > 0) {
      const scaleFactor = 3.5 / maxDimension;
      object.scale.setScalar(scaleFactor);
    }

    box.setFromObject(object);
    box.getCenter(center);
    object.position.set(-center.x, -center.y, -center.z);
    object.rotation.set(0, 0, 0);
  }, []);

  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();

      const { minDistance, maxDistance } = controlsRef.current;
      const delta = event.deltaY * 0.001 * 0.1;
      const newDistance = Math.max(
        minDistance,
        Math.min(maxDistance, controlsRef.current.currentDistance + delta),
      );

      controlsRef.current.currentDistance = newDistance;

      if (cameraRef.current) {
        const { x, y } = panOffsetRef.current;
        cameraRef.current.position.set(x, y, newDistance);
        cameraRef.current.lookAt(x, y, 0);
        setZoomLevel(calculateZoomPercentage(newDistance));
      }
    },
    [calculateZoomPercentage],
  );

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282424);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, controlsRef.current.initialDistance);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });

    const updateSize = () => {
      if (!mountRef.current) return;
      const { width, height } = mountRef.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const { x, y } = panOffsetRef.current;
      camera.lookAt(x, y, 0);
    };

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    updateSize();
    setTimeout(() => updateSize(), 100);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = createMaterial("basecolor", geometry);
    const mesh = new THREE.Mesh(geometry, material);
    centerAndScaleModel(mesh);
    scene.add(mesh);
    meshRef.current = mesh;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      // isDefaultCubeRef.current is read each frame — never stale, no re-render needed
      if (meshRef.current && isDefaultCubeRef.current) {
        meshRef.current.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    const canvas = renderer.domElement;
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("resize", updateSize);

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(mountRef.current);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", updateSize);
      resizeObserver.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const mats = Array.isArray(object.material)
            ? object.material
            : [object.material];
          mats.forEach((mat) => mat.dispose());
        }
      });
    };
  }, [centerAndScaleModel, handleWheel]); // isDefaultCubeRef removed — it's a ref, not state

  const resetCamera = useCallback(() => {
    if (!cameraRef.current || !meshRef.current) return;
    panOffsetRef.current = { x: 0, y: 0 };
    controlsRef.current.currentDistance = controlsRef.current.initialDistance;
    cameraRef.current.position.set(0, 0, controlsRef.current.initialDistance);
    cameraRef.current.lookAt(0, 0, 0);
    setZoomLevel(100);
  }, []);

  const handlePan = useCallback((deltaX, deltaY) => {
    if (!cameraRef.current) return;
    // Scale pan speed relative to zoom distance so it feels consistent
    const panSpeed = controlsRef.current.currentDistance * 0.001;
    panOffsetRef.current.x -= deltaX * panSpeed;
    panOffsetRef.current.y += deltaY * panSpeed;
    const { x, y } = panOffsetRef.current;
    const z = controlsRef.current.currentDistance;
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(x, y, 0);
  }, []);

  const replaceModel = useCallback(
    (newModel) => {
      if (!sceneRef.current || !newModel) return;

      if (meshRef.current) {
        sceneRef.current.remove(meshRef.current);
        meshRef.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            const mats = Array.isArray(child.material)
              ? child.material
              : [child.material];
            mats.forEach((mat) => {
              if (mat.map) mat.map.dispose();
              if (mat.normalMap) mat.normalMap.dispose();
              if (mat.roughnessMap) mat.roughnessMap.dispose();
              if (mat.metalnessMap) mat.metalnessMap.dispose();
              mat.dispose();
            });
          }
        });
      }

      sceneRef.current.add(newModel);
      meshRef.current = newModel;
      isDefaultCubeRef.current = false; // ref mutation — no re-render, no scene teardown
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
    zoomLevel,
    resetCamera,
    handlePan,
    replaceModel,
  };
};
