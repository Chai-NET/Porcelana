import * as THREE from "three";

export const createMatcapTexture = () => {
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

export const createMaterial = (mode, geometry) => {
  switch (mode) {
    case "wireframe":
      return new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        wireframe: true,
      });

    case "matcap":
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
