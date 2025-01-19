import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";
import PauseOverlay from "./components/PauseOverlay";
import WinMessage from "./components/WinMessage";

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = "easy" | "medium" | "hard";

interface DifficultyConfig {
  pairs: number;
  gridCols: number;
}

const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  easy: { pairs: 8, gridCols: 4 },
  medium: { pairs: 12, gridCols: 6 },
  hard: { pairs: 16, gridCols: 8 },
};

const emojis = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🦁",
  "🐯",
  "🐸",
  "🐵",
  "🦄",
  "🐷",
  "🦊",
  "🦒",
];

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    let timer: number | undefined;
    if (isPlaying && !isPaused) {
      timer = window.setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isPaused]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsPlaying(false);
    }
  }, [cards]);

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function initializeGame() {
    const { pairs } = difficultyConfig[difficulty];
    const selectedEmojis = emojis.slice(0, pairs);
    const duplicatedEmojis = [...selectedEmojis, ...selectedEmojis];
    const shuffledEmojis = duplicatedEmojis.sort(() => Math.random() - 0.5);
    const newCards = shuffledEmojis.map((emoji, index) => ({
      id: index,
      value: emoji,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(newCards);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setIsPaused(false);
    setMatches(0);
  }

  function handleCardClick(id: number) {
    if (
      isPaused ||
      cards.filter((card) => card.isFlipped).length === 2 ||
      cards[id].isMatched ||
      cards[id].isFlipped
    )
      return;

    const newCards = cards.map((card) =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    const flippedCards = newCards.filter(
      (card) => card.isFlipped && !card.isMatched
    );
    if (flippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.value === secondCard.value) {
        setCards(
          newCards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatches((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCards(
            newCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000);
      }
    }
  }

  function togglePause() {
    setIsPaused((prev) => !prev);
  }

  function handleDifficultyChange(newDifficulty: Difficulty) {
    setDifficulty(newDifficulty);
  }

  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      <div className="difficulty-selector">
        {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => handleDifficultyChange(level)}
            className={`difficulty-btn ${difficulty === level ? "active" : ""}`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
      <div className="game-info">
        <p>Time: {formatTime(time)}</p>
        <p>Moves: {moves}</p>
        <p>Matches: {matches}</p>
        {isPlaying && !cards.every((card) => card.isMatched) && (
          <button
            onClick={togglePause}
            className={isPaused ? "resume" : "pause"}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
        <button onClick={initializeGame}>New Game</button>
      </div>
      <div
        className={`card-grid ${isPaused ? "paused" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${difficultyConfig[difficulty].gridCols}, 1fr)`,
          maxWidth: `${difficultyConfig[difficulty].gridCols * 100}px`,
        }}
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
      {cards.every((card) => card.isMatched) && (
        <WinMessage moves={moves} time={time} formatTime={formatTime} />
      )}
      {isPaused && <PauseOverlay togglePause={togglePause} />}
    </div>
  );
}

export default App;
