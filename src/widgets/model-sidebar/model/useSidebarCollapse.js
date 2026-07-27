import { useState, useEffect, useCallback } from "react";
import { useScreenSize } from "@/shared/lib/hooks/useScreenSize";
import { SIDEBAR_COLLAPSE_BREAKPOINT } from "../config/sidebar";

export const useSidebarCollapse = () => {
  const { isSmallScreen } = useScreenSize(SIDEBAR_COLLAPSE_BREAKPOINT);
  const [isCollapsed, setIsCollapsed] = useState(isSmallScreen);

  useEffect(() => {
    setIsCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  const toggle = useCallback(() => setIsCollapsed((current) => !current), []);
  const collapse = useCallback(() => setIsCollapsed(true), []);

  return { isCollapsed, toggle, collapse };
};
