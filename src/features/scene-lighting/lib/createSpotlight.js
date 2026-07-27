import * as THREE from "three";
import { SPOTLIGHT } from "../config/lighting";

/** The light's target must be added to the scene alongside it to take aim. */
export const createSpotlight = () => {
  const { color, intensity, distance, angle, penumbra, decay, position } =
    SPOTLIGHT;

  const light = new THREE.SpotLight(
    color,
    intensity,
    distance,
    angle,
    penumbra,
    decay,
  );
  light.position.set(position.x, position.y, position.z);
  light.target.position.set(0, 0, 0);
  return light;
};
