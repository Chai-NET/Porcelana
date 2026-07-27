import { useState, useCallback, useEffect } from "react";

const ROTATION_SPEED = 0.01; // radians per pixel dragged

/**
 * Turns mouse drags into model rotation (left button) or camera pan (middle
 * button / Shift+left). Rotation mutates the pivot's `rotation` directly rather
 * than going through React state — the render loop reads it every frame.
 */
export const useModelInteraction = (meshRef, handlePan) => {
  const [interactionMode, setInteractionMode] = useState(null); // 'rotate' | 'pan' | null
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    // Middle-click or Shift+left-click → pan
    if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault(); // prevent middle-click autoscroll
      setInteractionMode("pan");
    } else if (e.button === 0) {
      setInteractionMode("rotate");
    }
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!interactionMode) return;

      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;

      if (interactionMode === "rotate" && meshRef.current) {
        meshRef.current.rotation.y += deltaX * ROTATION_SPEED;
        meshRef.current.rotation.x += deltaY * ROTATION_SPEED;
      } else if (interactionMode === "pan" && handlePan) {
        handlePan(deltaX, deltaY);
      }

      setLastMousePos({ x: e.clientX, y: e.clientY });
    },
    [interactionMode, lastMousePos, meshRef, handlePan],
  );

  const handleMouseUp = useCallback(() => setInteractionMode(null), []);

  useEffect(() => {
    if (!interactionMode) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [interactionMode, handleMouseMove, handleMouseUp]);

  return {
    handleMouseDown,
    isDragging: interactionMode !== null,
    isPanning: interactionMode === "pan",
  };
};
