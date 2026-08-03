import { useRef, useState, useCallback } from "react";
import { DEFAULT_TURNTABLE_SPEED } from "../config/scene";

export const useTurntable = () => {
  const isActiveRef = useRef(true);
  const [isActive, setIsActive] = useState(true);
  const speedRef = useRef(DEFAULT_TURNTABLE_SPEED);
  const [speed, setSpeedState] = useState(DEFAULT_TURNTABLE_SPEED);

  const setActive = useCallback((value) => {
    isActiveRef.current = value;
    setIsActive(value);
  }, []);

  const setSpeed = useCallback((value) => {
    speedRef.current = value;
    setSpeedState(value);
  }, []);

  const toggle = useCallback(
    () => setActive(!isActiveRef.current),
    [setActive],
  );

  const startAt = useCallback(
    (value) => {
      setSpeed(value);
      setActive(true);
    },
    [setSpeed, setActive],
  );

  const reset = useCallback(() => {
    setActive(true);
    setSpeed(DEFAULT_TURNTABLE_SPEED);
  }, [setActive, setSpeed]);

  return { isActiveRef, isActive, toggle, reset, speedRef, speed, startAt };
};
