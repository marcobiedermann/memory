interface WinMessageProps {
  moves: number;
  formattedDuration: string;
}

function WinMessage(props: WinMessageProps) {
  const { moves, formattedDuration } = props;

  return (
    <div className="win-message">
      Congratulations! You won in {moves} moves and {formattedDuration}!
    </div>
  );
}

export default WinMessage;
