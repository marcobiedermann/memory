import { random } from 'lodash-es';
import type { Card } from '../cards';

function generateCards(numberOfPairs: number): Card[] {
  const cards = [];

  for (let i = 2; i <= numberOfPairs + 1; i += 1) {
    const pairId = crypto.randomUUID();
    const result = i;
    const a = random(1, result - 1);
    const b = result - a;

    cards.push({
      id: crypto.randomUUID(),
      pairId,
      value: `${a}+${b}`,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: crypto.randomUUID(),
      pairId,
      value: `${a + b}`,
      isFlipped: false,
      isMatched: false,
    });
  }

  return cards;
}

export { generateCards };
