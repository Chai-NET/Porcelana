import { useRef, useEffect } from "react";
import { PRECISION_MODIFIER } from "@/shared/config/controls";
import {
  MOVEMENT_KEYS,
  KEYBOARD_PAN_STEP_PX,
  KEYBOARD_DOLLY_STEP,
} from "../config/movement";

const isEditableTarget = (target) =>
  target instanceof Element &&
  target.closest("input, textarea, select, [contenteditable]");

/**
 * WASD flight: W/S dolly the camera in and out, A/D strafe it sideways.
 * Movement runs on its own RAF loop that only lives while a key is held,
 * so an idle viewer schedules no extra frames.
 */
export const useKeyboardMovement = (panBy, zoomBy) => {
  const pressedKeysRef = useRef(new Set());
  const slowRef = useRef(false);
  const frameRef = useRef(null);

  useEffect(() => {
    const pressedKeys = pressedKeysRef.current;

    const applyMovement = () => {
      if (pressedKeys.size === 0) {
        frameRef.current = null;
        return;
      }

      const scale = slowRef.current ? PRECISION_MODIFIER : 1;
      const strafe =
        (pressedKeys.has("a") ? 1 : 0) - (pressedKeys.has("d") ? 1 : 0);
      const dolly =
        (pressedKeys.has("s") ? 1 : 0) - (pressedKeys.has("w") ? 1 : 0);

      if (strafe) panBy(strafe * KEYBOARD_PAN_STEP_PX * scale, 0);
      if (dolly) zoomBy(dolly * KEYBOARD_DOLLY_STEP * scale);

      frameRef.current = requestAnimationFrame(applyMovement);
    };

    const handleKeyDown = (event) => {
      slowRef.current = event.shiftKey;
      const key = event.key.toLowerCase();
      if (!MOVEMENT_KEYS.includes(key) || isEditableTarget(event.target)) {
        return;
      }
      pressedKeys.add(key);
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(applyMovement);
      }
    };

    const handleKeyUp = (event) => {
      slowRef.current = event.shiftKey;
      pressedKeys.delete(event.key.toLowerCase());
    };

    // Keyup never arrives for keys held across a focus loss.
    const handleBlur = () => pressedKeys.clear();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      pressedKeys.clear();
    };
  }, [panBy, zoomBy]);
};
