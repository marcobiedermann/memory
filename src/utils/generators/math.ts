import { shuffle } from 'lodash-es';
import type { Card } from '../cards';

function generateCards(): Card[] {
  const cards = [];

  for (let i = 2; i <= 10; i += 1) {
    const pairs = [];

    for (let x = 1; x <= 10; x += 1) {
      for (let y = 1; y <= 10; y += 1) {
        if (x + y === i) {
          const pairId = crypto.randomUUID();

          pairs.push([
            {
              id: crypto.randomUUID(),
              pairId,
              value: `${x}+${y}`,
              isFlipped: false,
              isMatched: false,
            },
            {
              id: crypto.randomUUID(),
              pairId,
              value: `${x + y}`,
              isFlipped: false,
              isMatched: false,
            },
          ]);
        }
      }
    }

    const pair = shuffle(pairs).slice(0, 1).flat();

    cards.push(pair);
  }

  return shuffle(cards).flat();
}

export { generateCards };
