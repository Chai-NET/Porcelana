import { useState, useRef, useCallback, useEffect } from "react";
import { PRECISION_MODIFIER } from "@/shared/config/controls";
import { ROTATION_SPEED, CLICK_DRAG_THRESHOLD_PX } from "../config/interaction";

export const useModelInteraction = (meshRef, handlePan, onContextMenu) => {
  const [interactionMode, setInteractionMode] = useState(null); // 'rotate' | 'pan' | null
  const lastPosRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const handleMouseDown = useCallback((e) => {
    // Middle-click or right-click → pan; left-click → rotate
    if (e.button === 1 || e.button === 2) {
      e.preventDefault(); // prevent middle-click autoscroll
      setInteractionMode("pan");
    } else if (e.button === 0) {
      setInteractionMode("rotate");
    } else {
      return;
    }
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    startPosRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
  }, []);

  /** The native menu is replaced by the viewer's own options menu. */
  const handleContextMenu = useCallback((e) => e.preventDefault(), []);

  useEffect(() => {
    if (!interactionMode) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - lastPosRef.current.x;
      const deltaY = e.clientY - lastPosRef.current.y;

      if (!hasDraggedRef.current) {
        const travel = Math.hypot(
          e.clientX - startPosRef.current.x,
          e.clientY - startPosRef.current.y,
        );
        hasDraggedRef.current = travel > CLICK_DRAG_THRESHOLD_PX;
      }

      if (interactionMode === "rotate" && meshRef.current) {
        const speed = e.shiftKey
          ? ROTATION_SPEED * PRECISION_MODIFIER
          : ROTATION_SPEED;
        meshRef.current.rotation.y += deltaX * speed;
        meshRef.current.rotation.x += deltaY * speed;
      } else if (interactionMode === "pan" && handlePan) {
        handlePan(deltaX, deltaY);
      }

      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = (e) => {
      // A right press that never travelled is a click: open the options menu.
      if (e.button === 2 && !hasDraggedRef.current) {
        onContextMenu?.({ x: e.clientX, y: e.clientY });
      }
      setInteractionMode(null);
    };

    // A right-drag released outside the canvas would still pop the native menu.
    const suppressContextMenu = (e) => e.preventDefault();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("contextmenu", suppressContextMenu);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("contextmenu", suppressContextMenu);
    };
  }, [interactionMode, meshRef, handlePan, onContextMenu]);

  return {
    handleMouseDown,
    handleContextMenu,
    isDragging: interactionMode !== null,
    isPanning: interactionMode === "pan",
  };
};
