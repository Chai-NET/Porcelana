import { useState, useCallback, useEffect } from "react";

export const useRotation = (meshRef) => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !meshRef.current) return;

      const deltaX = (e.clientX - lastMousePos.x) * 0.01;
      const deltaY = (e.clientY - lastMousePos.y) * 0.01;

      meshRef.current.rotation.y += deltaX;
      meshRef.current.rotation.x += deltaY;

      setLastMousePos({ x: e.clientX, y: e.clientY });
    },
    [isDragging, lastMousePos, meshRef],
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return { handleMouseDown, isDragging };
};
