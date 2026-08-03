import { useRef, useState, useCallback } from "react";

export const useZoomLock = () => {
  const isUnlockedRef = useRef(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [blockedCount, setBlockedCount] = useState(0);

  const setUnlocked = useCallback((value) => {
    isUnlockedRef.current = value;
    setIsUnlocked(value);
  }, []);

  const toggle = useCallback(
    () => setUnlocked(!isUnlockedRef.current),
    [setUnlocked],
  );
  const reset = useCallback(() => setUnlocked(false), [setUnlocked]);
  const reportBlocked = useCallback(
    () => setBlockedCount((count) => count + 1),
    [],
  );

  return {
    isUnlocked,
    isUnlockedRef,
    blockedCount,
    toggle,
    reset,
    reportBlocked,
  };
};
