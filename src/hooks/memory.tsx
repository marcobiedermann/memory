import { useState } from 'react';
import { useBoolean } from 'react-use';
import type { Card } from '../utils/cards';
import { getCardById, getFlippedUnmatched, isCardById, updateCard } from '../utils/cards';

const TIMEOUT = 1_000;

interface UseMemoryOptions {
  initialCards: Card[];
}

function useMemory(options: UseMemoryOptions) {
  const { initialCards } = options;
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [isChecking, toggleIsChecking] = useBoolean(false);
  const [moves, setMoves] = useState(0);

  const matches = Math.floor(cards.filter((card) => card.isMatched).length / 2);

  function onCardClick(id: string) {
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

    if (flippedUnmatchedCards.length === 2) {
      toggleIsChecking(true);

      const isMatch = flippedUnmatchedCards.every(
        (flippedUnmatchedCard) => flippedUnmatchedCard.pairId === card.pairId,
      );

      if (isMatch) {
        const updatedCards = cards.map((c) => {
          if (c.pairId === card.pairId) {
            const updatedCard = updateCard(c, {
              isMatched: true,
            });

            return updatedCard;
          }

          return c;
        });

        setCards(updatedCards);
        toggleIsChecking(false);
      } else {
        setTimeout(() => {
          const updatedCards = cards.map((c) => {
            if (flippedUnmatchedCards.some((flippedUnmatchedCard) => flippedUnmatchedCard.pairId === c.pairId)) {
              const updatedCard = updateCard(c, {
                isFlipped: false,
              });

              return updatedCard;
            }

            return c;
          });

          setCards(updatedCards);
          toggleIsChecking(false);
        }, TIMEOUT);
      }

      setMoves((moves) => moves + 1);
    }
  }

  function reset(cards = initialCards) {
    setCards(cards);
    toggleIsChecking(false);
    setMoves(0);
  }

  return {
    cards,
    isChecking,
    matches,
    moves,
    onCardClick,
    reset,
  };
}

export { useMemory };
