import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./App.css";
import Card from "./components/Card";
import PauseOverlay from "./components/PauseOverlay";
import WinMessage from "./components/WinMessage";

interface Card {
  id: string;
  value: string;
  pairId: string;
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

function generateCards(numberOfPairs: number): Card[] {
  const selectedEmojis = emojis.slice(0, numberOfPairs);
  const cards = selectedEmojis.flatMap((value) => {
    const pairId = crypto.randomUUID();

    return [
      {
        id: crypto.randomUUID(),
        pairId,
        value,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: crypto.randomUUID(),
        pairId,
        value,
        isFlipped: false,
        isMatched: false,
      },
    ];
  });

  return cards;
}

const formDataSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]),
});

type FormData = z.infer<typeof formDataSchema>;

function App() {
  const { register, watch } = useForm<FormData>({
    defaultValues: {
      difficulty: "easy",
    },
    resolver: zodResolver(formDataSchema),
  });
  const difficulty = watch("difficulty");
  const [cards, setCards] = useState<Card[]>(
    generateCards(difficultyConfig[difficulty].pairs)
  );
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
    setCards(generateCards(difficultyConfig[difficulty].pairs));
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
    setIsPaused(false);
    setMatches(0);
  }

  function handleCardClick(id: string) {
    const card = cards.find((card) => card.id === id)!;

    if (
      isPaused ||
      cards.filter((card) => card.isFlipped).length === 2 ||
      card.isMatched ||
      card.isFlipped
    )
      return;

    const newCards = cards.map((card) => {
      if (card.id === id) {
        return { ...card, isFlipped: true };
      }

      return card;
    });
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

  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      <form>
        <legend>Difficulty</legend>
        <div>
          <label htmlFor="easy">Easy</label>
          <div className="difficulty-selector">
            <input
              id="easy"
              type="radio"
              value="easy"
              className={`difficulty-btn ${
                difficulty === "easy" ? "active" : ""
              }`}
              {...register("difficulty")}
            />
          </div>
          <div>
            <label htmlFor="medium">Medium</label>
            <input
              id="medium"
              type="radio"
              value="medium"
              className={`difficulty-btn ${
                difficulty === "medium" ? "active" : ""
              }`}
              {...register("difficulty")}
            />
          </div>
          <div>
            <label htmlFor="hard">Hard</label>
            <input
              id="hard"
              type="radio"
              value="hard"
              className={`difficulty-btn ${
                difficulty === "hard" ? "active" : ""
              }`}
              {...register("difficulty")}
            />
          </div>
        </div>
      </form>
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
