import { shuffle } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from './components/Card';
import Cards from './components/Cards';
import PauseOverlay from './components/PauseOverlay';
import WinMessage from './components/WinMessage';
import { useMemory } from './hooks/memory';
import { useTimer } from './hooks/timer';
import { RootState } from './store';
import { isEveryCardMatched } from './utils/cards';
import { formatDuration, getDuration } from './utils/duration';

const DEBUG = false;

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
  easy: { pairs: 12, gridCols: 6 }, // 24
  medium: { pairs: 20, gridCols: 8 }, // 40
  hard: { pairs: 30, gridCols: 10 }, // 60
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

const PAIR_LENGTH = 2;

function generateCards(symbols: string[], numberOfPairs: number): Card[] {
  const selectedSymbols = shuffle(symbols).slice(0, numberOfPairs);
  const cards = selectedSymbols.flatMap((value) => {
    const pairId = crypto.randomUUID();

    return Array.from({ length: PAIR_LENGTH }, () => {
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

  const generatedCards = useMemo(
    () => generateCards(settings.symbols === 'emojies' ? emojis : numbers, difficultyConfig[settings.difficulty].pairs),
    [settings],
  );
  const {
    cards,
    isChecking,
    matches,
    moves,
    onCardClick,
    reset: resetMemory,
  } = useMemory({
    initialCards: DEBUG ? generatedCards : shuffle(generatedCards),
  });

  const { isRunning, isPaused, currentDate, createdAt, reset: resetTimer, pause, start } = useTimer();
  const duration = getDuration(currentDate, createdAt);

  function initializeGame() {
    resetMemory(DEBUG ? generatedCards : shuffle(generatedCards));
    resetTimer();
  }

  useEffect(() => {
    if (isEveryCardMatched(cards)) {
      pause();
    }
  }, [cards]);

  return (
    <div className="app">
      <h1>Memory Game</h1>

      <div className="game-info">
        {settings.showTimer && <div>Time: {formatDuration(duration)}</div>}
        <div>Moves: {moves}</div>
        <div>
          Matches: {matches}/{cards.length / PAIR_LENGTH}
        </div>
        {settings.showTimer && (
          <button onClick={() => (isRunning ? pause() : start())} className="button">
            {isRunning ? 'Pause' : 'Resume'}
          </button>
        )}
        <button onClick={initializeGame} className="button">
          New Game
        </button>
      </div>

      <Cards
        disabled={isChecking}
        cards={cards}
        onCardClick={onCardClick}
        style={{
          gridTemplateColumns: `repeat(${difficultyConfig[settings.difficulty].gridCols}, 1fr)`,
        }}
      />

      {isEveryCardMatched(cards) && <WinMessage moves={moves} formattedDuration={formatDuration(duration)} />}
      {isPaused && <PauseOverlay togglePause={() => (isRunning ? pause() : start())} />}
      <p>
        <Link to="/settings">Settings</Link>
      </p>
    </div>
  );
}

export default App;
