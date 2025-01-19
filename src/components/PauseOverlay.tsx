import React from "react";

interface PauseOverlayProps {
  togglePause: () => void;
}

const PauseOverlay: React.FC<PauseOverlayProps> = ({ togglePause }) => {
  return (
    <div className="pause-overlay">
      <h2>Game Paused</h2>
      <button onClick={togglePause}>Resume</button>
    </div>
  );
};

export default PauseOverlay;
