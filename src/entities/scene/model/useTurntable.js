import { useRef, useState, useCallback } from "react";

/**
 * Turntable on/off is both a render-loop fact (read fresh every frame, so a
 * ref) and a UI fact (the menu label, so state). This hook keeps the two in
 * sync behind one setter.
 */
export const useTurntable = () => {
  const isActiveRef = useRef(false);
  const [isActive, setIsActive] = useState(false);

  const setActive = useCallback((value) => {
    isActiveRef.current = value;
    setIsActive(value);
  }, []);

  const toggle = useCallback(
    () => setActive(!isActiveRef.current),
    [setActive],
  );
  const stop = useCallback(() => setActive(false), [setActive]);

  return { isActiveRef, isActive, toggle, stop };
};
