import { useState, useCallback } from "react";

/** Where the options menu is open, or null when it is not. */
export const useOptionsMenu = () => {
  const [position, setPosition] = useState(null); // {x, y} | null

  const open = useCallback((point) => setPosition(point), []);
  const close = useCallback(() => setPosition(null), []);

  return { position, open, close };
};
