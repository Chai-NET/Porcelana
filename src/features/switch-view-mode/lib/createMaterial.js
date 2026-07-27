import * as THREE from "three";
import { ACCENT_COLOR } from "@/shared/config/theme";
import { FALLBACK_TEXTURE_URL } from "@/shared/config/texture";

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

  return new THREE.CanvasTexture(canvas);
};

/** Builds the material a view mode paints onto a mesh. */
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
      return new THREE.MeshLambertMaterial({ color: ACCENT_COLOR });

    case "normals":
      return new THREE.MeshNormalMaterial();

    // Only reached when the model has no authored material to restore.
    case "original":
      return new THREE.MeshLambertMaterial({ color: ACCENT_COLOR });

    case "texture":
      if (customTexture) {
        return new THREE.MeshBasicMaterial({ map: customTexture });
      }
      if (geometry?.attributes?.uv) {
        return new THREE.MeshBasicMaterial({
          map: new THREE.TextureLoader().load(FALLBACK_TEXTURE_URL),
        });
      }
      return new THREE.MeshLambertMaterial({ color: 0x4e8eed });

    default:
      return new THREE.MeshLambertMaterial({ color: 0x00aa88 });
  }
};
