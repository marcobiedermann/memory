interface CardProps {
  card: {
    id: string;
    value: string;
    pairId: string;
    isFlipped: boolean;
    isMatched: boolean;
  };
  onClick: (id: string) => void;
}

function Card(props: CardProps) {
  const { card, onClick } = props;

  return (
    <div
      key={card.id}
      className={`card ${card.isFlipped ? "flipped" : ""} ${
        card.isMatched ? "matched" : ""
      }`}
      onClick={() => onClick(card.id)}
    >
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{card.value}</div>
      </div>
    </div>
  );
}

export default Card;
