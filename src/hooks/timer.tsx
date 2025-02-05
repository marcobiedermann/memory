import { useState } from 'react';
import { useBoolean, useInterval } from 'react-use';

function useTimer() {
  const delay = 1000;
  const now = new Date();

  const [createdAt, setCreatedAt] = useState(now);
  const [currentDate, setCurrentDate] = useState(now);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  const isPaused = !isRunning;

  function pause() {
    toggleIsRunning(false);
  }

  function start() {
    toggleIsRunning(true);
  }

  function reset() {
    const now = new Date();

    setCreatedAt(now);
    toggleIsRunning(true);
  }

  useInterval(
    () => {
      const now = new Date();

      setCurrentDate(now);
    },
    isRunning ? delay : null,
  );

  return {
    isRunning,
    isPaused,
    createdAt,
    currentDate,
    reset,
    pause,
    start,
  };
}

export { useTimer };
