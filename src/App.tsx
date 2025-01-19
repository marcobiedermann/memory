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

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

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

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    let timer: number | undefined;
    if (isPlaying && !isPaused) {
      timer = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, isPaused]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const initializeGame = () => {
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
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleCardClick = (id: number) => {
    if (isPaused || flippedCards.length === 2) return;
    if (cards[id].isMatched || cards[id].isFlipped) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;
      if (cards[firstCard].value === cards[secondCard].value) {
        newCards[firstCard].isMatched = true;
        newCards[secondCard].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          newCards[firstCard].isFlipped = false;
          newCards[secondCard].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  const isGameComplete =
    cards.length > 0 && cards.every((card) => card.isMatched);

  useEffect(() => {
    if (isGameComplete) {
      setIsPlaying(false);
    }
  }, [isGameComplete]);

  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      <div className="difficulty-selector">
        <button
          onClick={() => handleDifficultyChange("easy")}
          className={`difficulty-btn ${difficulty === "easy" ? "active" : ""}`}
        >
          Easy
        </button>
        <button
          onClick={() => handleDifficultyChange("medium")}
          className={`difficulty-btn ${
            difficulty === "medium" ? "active" : ""
          }`}
        >
          Medium
        </button>
        <button
          onClick={() => handleDifficultyChange("hard")}
          className={`difficulty-btn ${difficulty === "hard" ? "active" : ""}`}
        >
          Hard
        </button>
      </div>
      <div className="game-info">
        <p>Time: {formatTime(time)}</p>
        <p>Moves: {moves}</p>
        {isPlaying && !isGameComplete && (
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
      {isGameComplete && (
        <WinMessage moves={moves} time={time} formatTime={formatTime} />
      )}
      {isPaused && <PauseOverlay togglePause={togglePause} />}
    </div>
  );
}

export default App;
