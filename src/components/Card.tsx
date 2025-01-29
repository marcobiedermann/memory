interface CardProps {
  id: string;
  value: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (id: string) => void;
}

function Card(props: CardProps) {
  const { id, isFlipped, isMatched, value, onClick } = props;

  return (
    <div className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`} onClick={() => onClick(id)}>
      <div className="card-inner">
        <div className="card-front">?</div>
        <div className="card-back">{value}</div>
      </div>
    </div>
  );
}

export type { CardProps };
export default Card;
