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

export const createMaterial = (mode, geometry, customTexture) => {
  switch (mode) {
    case "wireframe":
      return new THREE.MeshBasicMaterial({
        color: 0x444444,
        wireframe: true,
      });

    case "matcap":
      return new THREE.MeshMatcapMaterial({
        color: 0x888888,
        matcap: createMatcapTexture(),
      });

    case "basecolor":
      return new THREE.MeshLambertMaterial({
        color: 0x869fef,
      });

    case "normals":
      return new THREE.MeshNormalMaterial();

    case "texture":
      if (customTexture) {
        return new THREE.MeshBasicMaterial({ map: customTexture });
      } else if (geometry && geometry.attributes && geometry.attributes.uv) {
        const texture = new THREE.TextureLoader().load(
          "https://threejs.org/examples/textures/uv_grid_opengl.jpg",
        );
        return new THREE.MeshBasicMaterial({ map: texture });
      } else {
        return new THREE.MeshLambertMaterial({ color: 0x4e8eed });
      }

    default:
      return new THREE.MeshLambertMaterial({ color: 0x00aa88 });
  }
};
