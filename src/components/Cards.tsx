import { HTMLAttributes } from 'react';
import type { CardProps } from './Card';
import Card from './Card';

interface CardsProps extends HTMLAttributes<HTMLUListElement> {
  disabled?: boolean;
  cards: Omit<CardProps, 'disabled' | 'onClick'>[];
  onCardClick: (id: string) => void;
}

function Cards(props: CardsProps) {
  const { disabled, cards, onCardClick, ...otherProps } = props;

  return (
    <ul className="cards" {...otherProps}>
      {cards.map((card) => {
        const { id } = card;

        return (
          <li key={id}>
            <Card onClick={onCardClick} disabled={disabled} {...card} />
          </li>
        );
      })}
    </ul>
  );
}

export type { CardsProps };
export default Cards;
