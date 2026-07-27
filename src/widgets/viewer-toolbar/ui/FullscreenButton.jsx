import { useState, useEffect } from "react";
import { GoScreenFull, GoScreenNormal } from "react-icons/go";

export default function FullscreenButton({ className }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateState = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", updateState);
    return () => document.removeEventListener("fullscreenchange", updateState);
  }, []);

  const toggleFullscreen = () =>
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen().catch(console.error);

  return (
    <button
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      className={className}
    >
      {isFullscreen ? <GoScreenNormal size={20} /> : <GoScreenFull size={20} />}
    </button>
  );
}
