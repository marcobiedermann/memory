import React from "react";

interface WinMessageProps {
  moves: number;
  time: number;
  formatTime: (time: number) => string;
}

const WinMessage: React.FC<WinMessageProps> = ({ moves, time, formatTime }) => {
  return (
    <div className="win-message">
      Congratulations! You won in {moves} moves and {formatTime(time)}!
    </div>
  );
};

export default WinMessage;
