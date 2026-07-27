import { useState, useEffect, useCallback } from "react";
import {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_SNAP_CLOSED_WIDTH,
} from "../config/sidebar";

const clampWidth = (width) =>
  Math.min(Math.max(width, SIDEBAR_MIN_WIDTH), SIDEBAR_MAX_WIDTH);

export const useSidebarResize = ({ onSnapClosed }) => {
  const [width, setWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const startResize = useCallback((event) => {
    if (event.button !== 0) return;

    event.preventDefault();
    event.currentTarget.focus();
    setIsResizing(true);
  }, []);

  const resizeBy = useCallback((delta) => {
    setWidth((current) => clampWidth(current + delta));
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (event) => {
      if (event.clientX < SIDEBAR_SNAP_CLOSED_WIDTH) {
        setIsResizing(false);
        onSnapClosed();
        return;
      }
      setWidth(clampWidth(event.clientX));
    };
    const stopResize = () => setIsResizing(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);

    const { cursor, userSelect } = document.body.style;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
      document.body.style.cursor = cursor;
      document.body.style.userSelect = userSelect;
    };
  }, [isResizing, onSnapClosed]);

  return { width, isResizing, startResize, resizeBy };
};
