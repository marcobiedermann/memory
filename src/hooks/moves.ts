import { useState } from 'react';

function useMoves() {
  const [moves, setMoves] = useState(0);

  return {
    moves,
    setMoves,
  };
}

export { useMoves };
