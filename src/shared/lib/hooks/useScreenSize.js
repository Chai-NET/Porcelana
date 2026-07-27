import { useState, useEffect } from "react";
import { MIN_SUPPORTED_WIDTH } from "@/shared/config/theme";

export const useScreenSize = (breakpoint = MIN_SUPPORTED_WIDTH) => {
  const [screenWidth, setScreenWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isSmallScreen: screenWidth < breakpoint, screenWidth };
};
