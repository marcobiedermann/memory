import { shuffle } from 'lodash-es';
import type { Card } from '../cards';

function generateCards(symbols: string[], numberOfPairs: number): Card[] {
  const selectedSymbols = shuffle(symbols).slice(0, numberOfPairs);
  const cards = selectedSymbols.flatMap((value) => {
    const pairId = crypto.randomUUID();

    return Array.from({ length: 2 }, () => {
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

export { generateCards };
