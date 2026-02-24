import { useState, useEffect } from "react";

export const useScreenSize = (breakpoint = 1250) => {
  const [screenWidth, setScreenWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isSmallScreen: screenWidth < breakpoint, screenWidth };
};
