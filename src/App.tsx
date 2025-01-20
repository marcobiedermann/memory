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
  showTimer: z.boolean(),
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

const pairLength = 2;

function generateCards(numberOfPairs: number): Card[] {
  const selectedEmojis = emojis.slice(0, numberOfPairs);
  const cards = selectedEmojis.flatMap((value) => {
    const pairId = crypto.randomUUID();

    return Array.from({ length: pairLength }, () => ({
      id: crypto.randomUUID(),
      pairId,
      value,
      isFlipped: false,
      isMatched: false,
    }));
  });

  return cards;
}

function isCardById(card: Card, id: string) {
  return card.id === id;
}

function isFippedCard(card: Card) {
  return card.isFlipped;
}

function isUnmatchedCard(card: Card) {
  return !card.isMatched;
}

function getCardById(cards: Card[], id: string) {
  return cards.find((card) => isCardById(card, id));
}

function getFlippedCards(cards: Card[]) {
  return cards.filter(isFippedCard);
}

function getFlippedUnmatched(cards: Card[]) {
  return cards.filter((card) => isFippedCard(card) && isUnmatchedCard(card));
}

function updateCard(card: Card, props: Partial<Card>) {
  return {
    ...card,
    ...props,
  };
}

function incrementMatch(match: number, amount = 1) {
  return match + amount;
}

function incrementMove(move: number, amount = 1) {
  return move + amount;
}

function formatDuration(duration: Duration) {
  return duration.format("mm:ss");
}

function App() {
  // Settings
  const { register, watch } = useForm<FormData>({
    defaultValues: {
      difficulty: "easy",
      showTimer: true,
    },
    resolver: zodResolver(formDataSchema),
  });
  const difficulty = watch("difficulty");
  const showTimer = watch("showTimer");

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
  const isPaused = !isRunning;
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
    const card = getCardById(cards, id);

    if (!card) {
      return;
    }

    const flippedCards = getFlippedCards(cards);

    if (
      isPaused ||
      flippedCards.length === pairLength ||
      card.isMatched ||
      card.isFlipped
    ) {
      return;
    }

    const updatedCards = cards.map((card) => {
      if (isCardById(card, id)) {
        const updatedCard = updateCard(card, {
          isFlipped: true,
        });

        return updatedCard;
      }

      return card;
    });

    setCards(updatedCards);

    const flippedUnmatchedCards = getFlippedUnmatched(updatedCards);

    if (flippedUnmatchedCards.length === pairLength) {
      if (
        flippedUnmatchedCards.every(
          (card) => card.id === flippedUnmatchedCards.at(0)?.id
        )
      ) {
        setCards(
          updatedCards.map((card) => {
            if (flippedUnmatchedCards.some((card) => isCardById(card, id))) {
              const updatedCard = updateCard(card, {
                isMatched: true,
              });

              return updatedCard;
            }

            return card;
          })
        );

        setMatches(incrementMatch);
      } else {
        setTimeout(() => {
          setCards(
            updatedCards.map((card) => {
              if (
                flippedUnmatchedCards.some((flippedUnmatchedCard) =>
                  isCardById(card, flippedUnmatchedCard.id)
                )
              ) {
                const updatedCard = updateCard(card, {
                  isFlipped: false,
                });

                return updatedCard;
              }

              return card;
            })
          );
        }, 1000);
      }

      setMoves(incrementMove);
    }
  }

  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      <form>
        <div>
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
        </div>
        <div>
          <label htmlFor="showTimer">Show Timer</label>
          <input type="checkbox" {...register("showTimer")} />
        </div>
      </form>
      <div className="game-info">
        {showTimer && <p>Time: {formatDuration(duration)}</p>}
        <p>Moves: {moves}</p>
        <p>Matches: {matches}</p>
        {showTimer && (
          <button
            onClick={toggleIsRunning}
            className={isRunning ? "pause" : "resume"}
          >
            {isRunning ? "Pause" : "Resume"}
          </button>
        )}
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
