import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import durationPlugin, { Duration } from "dayjs/plugin/duration";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useBoolean, useInterval } from "react-use";
import { z } from "zod";
import "./App.css";
import Card from "./components/Card";
import PauseOverlay from "./components/PauseOverlay";
import WinMessage from "./components/WinMessage";

dayjs.extend(durationPlugin);

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
  medium: { pairs: 18, gridCols: 6 },
  hard: { pairs: 32, gridCols: 8 },
};

const formDataSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"]),
});

type FormData = z.infer<typeof formDataSchema>;

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
  "🦒",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🐣",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
  "🐗",
  "🐴",
  "🦓",
  "🦌",
  "🐮",
  "🐂",
  "🐃",
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

function formatDuration(duration: Duration) {
  return duration.format("mm:ss");
}

function App() {
  // Settings
  const { register, watch } = useForm<FormData>({
    defaultValues: {
      difficulty: "easy",
    },
    resolver: zodResolver(formDataSchema),
  });
  const difficulty = watch("difficulty");

  // Cards
  const [cards, setCards] = useState<Card[]>(
    generateCards(difficultyConfig[difficulty].pairs)
  );
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  // Timer
  const now = new Date();
  const [startTime, setStartTime] = useState<Date>(now);
  const [currentTime, setCurrentTime] = useState<Date>(now);
  const [delay] = useState(1000);
  const [isRunning, toggleIsRunning] = useBoolean(true);
  const duration = dayjs.duration(dayjs(currentTime).diff(dayjs(startTime)));

  useInterval(
    () => {
      const now = new Date();

      setCurrentTime(now);
    },
    isRunning ? delay : null
  );

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      toggleIsRunning(false);
    }
  }, [cards]);

  function initializeGame() {
    setCards(generateCards(difficultyConfig[difficulty].pairs));
    setMoves(0);
    setMatches(0);
    setStartTime(new Date());
    toggleIsRunning(true);
  }

  function handleCardClick(id: string) {
    const card = cards.find((card) => card.id === id)!;

    if (
      !isRunning ||
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
        <p>Time: {formatDuration(duration)}</p>
        <p>Moves: {moves}</p>
        <p>Matches: {matches}</p>
        <button
          onClick={toggleIsRunning}
          className={isRunning ? "pause" : "resume"}
        >
          {isRunning ? "Pause" : "Resume"}
        </button>
        <button onClick={initializeGame}>New Game</button>
      </div>
      <div
        className="card-grid"
        style={{
          gridTemplateColumns: `repeat(${difficultyConfig[difficulty].gridCols}, 1fr)`,
        }}
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
      {cards.every((card) => card.isMatched) && (
        <WinMessage
          moves={moves}
          formattedDuration={formatDuration(duration)}
        />
      )}
      {!isRunning && <PauseOverlay togglePause={toggleIsRunning} />}
    </div>
  );
}

export default App;
