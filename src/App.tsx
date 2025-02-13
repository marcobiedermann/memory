import { shuffle } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Cards from './components/Cards';
import PauseOverlay from './components/PauseOverlay';
import WinMessage from './components/WinMessage';
import { useMemory } from './hooks/memory';
import { useTimer } from './hooks/timer';
import { RootState } from './store';
import { isEveryCardMatched } from './utils/cards';
import { formatDuration, getDuration } from './utils/duration';
import { generateCards } from './utils/generators/math';

const DEBUG = false;

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

const PAIR_LENGTH = 2;

function App() {
  const settings = useSelector((state: RootState) => state.settings);
  const { t } = useTranslation();

  const generatedCards = useMemo(() => generateCards(), [settings]);
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
      <h1>{t('game.title')}</h1>

      <div className="game-info">
        {settings.showTimer && (
          <div>
            {t('time')}: {formatDuration(duration)}
          </div>
        )}
        <div>
          {t('moves')}: {moves}
        </div>
        <div>
          {t('matches')}: {matches}/{cards.length / PAIR_LENGTH}
        </div>
        {settings.showTimer && (
          <button onClick={() => (isRunning ? pause() : start())} className="button">
            {isRunning ? t('timer.pause') : t('timer.resume')}
          </button>
        )}
        <button onClick={initializeGame} className="button">
          {t('game.new')}
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
        <Link to="/settings">{t('settings.title')}</Link>
      </p>
    </div>
  );
}

export default App;
