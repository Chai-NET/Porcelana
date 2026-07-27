import { useRef, useState, useCallback, useEffect } from "react";
import { createSpotlight } from "../lib/createSpotlight";

/** Toggles a spotlight above the model on and off. */
export const useSceneLighting = (sceneRef) => {
  const lightRef = useRef(null);
  const [isLightOn, setIsLightOn] = useState(false);

  const removeLight = useCallback(() => {
    const scene = sceneRef.current;
    const light = lightRef.current;
    if (!light) return;

    scene?.remove(light.target);
    scene?.remove(light);
    light.dispose();
    lightRef.current = null;
  }, [sceneRef]);

  const toggleLight = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (lightRef.current) {
      removeLight();
      setIsLightOn(false);
    } else {
      const light = createSpotlight();
      scene.add(light);
      scene.add(light.target);
      lightRef.current = light;
      setIsLightOn(true);
    }
  }, [sceneRef, removeLight]);

  const turnLightOff = useCallback(() => {
    removeLight();
    setIsLightOn(false);
  }, [removeLight]);

  useEffect(() => removeLight, [removeLight]);

  return { isLightOn, toggleLight, turnLightOff };
};
