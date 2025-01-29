import { shuffle } from 'lodash-es';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useBoolean, useInterval } from 'react-use';
import './App.css';
import Card from './components/Card';
import Cards from './components/Cards';
import PauseOverlay from './components/PauseOverlay';
import WinMessage from './components/WinMessage';
import { useMoves } from './hooks/moves';
import { RootState } from './store';
import { getCardById, getFlippedUnmatched, isCardById, isEveryCardMatched, updateCard } from './utils/cards';
import { formatDuration, getDuration } from './utils/duration';
import { incrementMatch } from './utils/matches';
import { incrementMove } from './utils/moves';

interface Card {
  id: string;
  value: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  pairs: number;
  gridCols: number;
}

const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  easy: { pairs: 8, gridCols: 4 },
  medium: { pairs: 18, gridCols: 6 },
  hard: { pairs: 32, gridCols: 8 },
};

const emojis = [
  '🐶',
  '🐱',
  '🐭',
  '🐹',
  '🐰',
  '🦊',
  '🐻',
  '🐼',
  '🦁',
  '🐯',
  '🐸',
  '🐵',
  '🦄',
  '🐷',
  '🦒',
  '🐔',
  '🐧',
  '🐦',
  '🐤',
  '🐣',
  '🦆',
  '🦅',
  '🦉',
  '🦇',
  '🐺',
  '🐗',
  '🐴',
  '🦓',
  '🦌',
  '🐮',
  '🐂',
  '🐃',
];

const numbers = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
];

const pairLength = 2;

function generateCards(symbols: string[], numberOfPairs: number): Card[] {
  const selectedSymbols = shuffle(symbols).slice(0, numberOfPairs);
  const cards = selectedSymbols.flatMap((value) => {
    const pairId = crypto.randomUUID();

    return Array.from({ length: pairLength }, () => {
      const id = crypto.randomUUID();

      return {
        id,
        pairId,
        value,
        isFlipped: false,
        isMatched: false,
      };
    });
  });

  return cards;
}

function App() {
  const settings = useSelector((state: RootState) => state.settings);

  // Cards
  const [cards, setCards] = useState<Card[]>(
    generateCards(settings.symbols === 'emojies' ? emojis : numbers, difficultyConfig[settings.difficulty].pairs),
  );
  const { moves, setMoves } = useMoves();
  const [matches, setMatches] = useState(0);

  // Timer
  const now = new Date();
  const [startTime, setStartTime] = useState<Date>(now);
  const [currentTime, setCurrentTime] = useState<Date>(now);
  const [delay] = useState(1000);
  const [isRunning, toggleIsRunning] = useBoolean(true);
  const isPaused = !isRunning;
  const duration = getDuration(currentTime, startTime);

  useInterval(
    () => {
      const now = new Date();

      setCurrentTime(now);
    },
    isRunning ? delay : null,
  );

  useEffect(() => {
    initializeGame();
  }, [settings.difficulty, settings.symbols]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      toggleIsRunning(false);
    }
  }, [cards]);

  function initializeGame() {
    setCards(
      generateCards(settings.symbols === 'emojies' ? emojis : numbers, difficultyConfig[settings.difficulty].pairs),
    );
    setMoves(0);
    setMatches(0);
    setStartTime(new Date());
    toggleIsRunning(true);
  }

  function handleCardClick(id: string) {
    const card = getCardById(cards, id);

    if (!card || card.isMatched || card.isFlipped) {
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
      if (flippedUnmatchedCards.every((flippedUnmatchedCard) => flippedUnmatchedCard.pairId === card.pairId)) {
        const updatedCards = cards.map((flippedUnmatchedCard) => {
          if (flippedUnmatchedCard.pairId === card.pairId) {
            const updatedCard = updateCard(flippedUnmatchedCard, {
              isMatched: true,
            });

            return updatedCard;
          }

          return flippedUnmatchedCard;
        });

        setCards(updatedCards);
        setMatches(incrementMatch);
      } else {
        setTimeout(() => {
          const updatedCards = cards.map((flippedUnmatchedCard) => {
            if (
              flippedUnmatchedCards.some(
                (flippedUnmatchedCard) => flippedUnmatchedCard.pairId === flippedUnmatchedCard.pairId,
              )
            ) {
              const updatedCard = updateCard(flippedUnmatchedCard, {
                isFlipped: false,
              });

              return updatedCard;
            }

            return flippedUnmatchedCard;
          });

          setCards(updatedCards);
        }, 1000);
      }

      setMoves(incrementMove);
    }
  }

  return (
    <div className="app">
      <h1>Memory Game</h1>

      <div className="game-info">
        {settings.showTimer && <p>Time: {formatDuration(duration)}</p>}
        <p>Moves: {moves}</p>
        <p>Matches: {matches}</p>
        {settings.showTimer && (
          <button onClick={toggleIsRunning} className={isRunning ? 'pause' : 'resume'}>
            {isRunning ? 'Pause' : 'Resume'}
          </button>
        )}
        <button onClick={initializeGame}>New Game</button>
      </div>
      <Cards
        cards={cards}
        onCardClick={handleCardClick}
        style={{
          gridTemplateColumns: `repeat(${difficultyConfig[settings.difficulty].gridCols}, 1fr)`,
        }}
      />

      {isEveryCardMatched(cards) && <WinMessage moves={moves} formattedDuration={formatDuration(duration)} />}
      {isPaused && <PauseOverlay togglePause={toggleIsRunning} />}
      <Link to="/settings">Settings</Link>
    </div>
  );
}

export default App;
