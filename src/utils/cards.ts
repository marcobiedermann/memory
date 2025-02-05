interface Card {
  id: string;
  value: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function isCardById(card: Card, id: string) {
  return card.id === id;
}

function isEveryCardMatched(cards: Card[]) {
  return cards.every((card) => card.isMatched);
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

function getFlippedUnmatched(cards: Card[]) {
  return cards.filter((card) => isFippedCard(card) && isUnmatchedCard(card));
}

function updateCard(card: Card, props: Partial<Card>) {
  return {
    ...card,
    ...props,
  };
}

export { getCardById, getFlippedUnmatched, isCardById, isEveryCardMatched, isFippedCard, isUnmatchedCard, updateCard };
export type { Card };
