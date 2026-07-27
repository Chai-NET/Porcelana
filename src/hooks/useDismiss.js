import { useEffect } from "react";

export const useDismiss = (ref, isOpen, onDismiss) => {
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!ref.current?.contains(event.target)) onDismiss();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, isOpen, onDismiss]);
};
