import * as THREE from "three";
import { ACCENT_COLOR } from "@/shared/config/theme";
import { NORMALIZED_MODEL_SIZE } from "../config/scene";

const measure = (object) => {
  object.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(object);
};

export const createCenteredPivot = (object) => {
  object.position.set(0, 0, 0);

  const size = measure(object).getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z);
  if (maxDimension > 0) {
    object.scale.multiplyScalar(NORMALIZED_MODEL_SIZE / maxDimension);
  }

  const center = measure(object).getCenter(new THREE.Vector3());
  object.position.copy(center).negate();

  const pivot = new THREE.Group();
  pivot.add(object);
  return pivot;
};

export const createPlaceholderModel = () =>
  createCenteredPivot(
    new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: ACCENT_COLOR }),
    ),
  );
