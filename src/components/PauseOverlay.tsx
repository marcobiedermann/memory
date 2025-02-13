interface PauseOverlayProps {
  togglePause: () => void;
}

function PauseOverlay(props: PauseOverlayProps) {
  const { togglePause } = props;
  return (
    <div className="pause-overlay">
      <h2>Game Paused</h2>
      <button onClick={togglePause}>Resume</button>
    </div>
  );
}

export default PauseOverlay;
