import * as THREE from "three";
import { ACCENT_COLOR } from "@/shared/config/theme";
import { NORMALIZED_MODEL_SIZE } from "../config/scene";

const measure = (object) => {
  object.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(object);
};

/**
 * Normalizes `object` and returns a pivot group holding it.
 *
 * The object is uniformly scaled so its largest dimension is
 * NORMALIZED_MODEL_SIZE, then offset *inside* the group so its bounding-box
 * centre lands exactly on the group's origin.
 *
 * The wrapper is what makes the origin usable. Authored models are rarely built
 * around their own node origin — a GLB exported from a scene can sit metres away
 * from it. Moving the object itself to the world centre leaves its transform
 * origin off to one side, so rotating it swings the model through the viewport
 * instead of spinning it in place. Rotating the pivot instead means every model,
 * uploaded or bundled, turns about its own visual centre.
 *
 * The root's own translation is dropped (centring replaces it) but its rotation
 * and scale are kept and only multiplied into: a root transform is how an
 * exporter encodes an up-axis correction, and discarding it lays such models on
 * their side. Measuring has to happen after the scale is applied and before the
 * offset is written, or the box being measured is not the box being centred.
 */
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

/** The spinning placeholder shown until a model is loaded. */
export const createPlaceholderModel = () =>
  createCenteredPivot(
    new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshLambertMaterial({ color: ACCENT_COLOR }),
    ),
  );
