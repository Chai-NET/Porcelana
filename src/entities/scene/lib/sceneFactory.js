import * as THREE from "three";
import { SCENE_BACKGROUND_COLOR } from "@/shared/config/theme";
import { CAMERA } from "../config/scene";

export const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SCENE_BACKGROUND_COLOR);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(1, 1, 1);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
  fillLight.position.set(-1, -1, -1);
  scene.add(fillLight);

  return scene;
};

export const createCamera = () =>
  new THREE.PerspectiveCamera(CAMERA.fov, 1, CAMERA.near, CAMERA.far);

export const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  return renderer;
};
