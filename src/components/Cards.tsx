import { HTMLAttributes } from 'react';
import type { CardProps } from './Card';
import Card from './Card';

interface CardsProps extends HTMLAttributes<HTMLUListElement> {
  cards: Omit<CardProps, 'onClick'>[];
  onCardClick: (id: string) => void;
}

function Cards(props: CardsProps) {
  const { cards, onCardClick, ...otherProps } = props;

  return (
    <ul className="cards" {...otherProps}>
      {cards.map((card) => {
        const { id } = card;

        return (
          <li key={id}>
            <Card onClick={onCardClick} {...card} />
          </li>
        );
      })}
    </ul>
  );
}

export type { CardsProps };
export default Cards;
