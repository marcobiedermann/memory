interface WinMessageProps {
  moves: number;
  time: number;
  formatTime: (time: number) => string;
}

function WinMessage(props: WinMessageProps) {
  const { moves, time, formatTime } = props;
  return (
    <div className="win-message">
      Congratulations! You won in {moves} moves and {formatTime(time)}!
    </div>
  );
}

export default WinMessage;
