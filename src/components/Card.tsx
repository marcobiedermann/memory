interface CardProps {
  id: string;
  value: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
  disabled?: boolean;
  onClick: (id: string) => void;
}

function Card(props: CardProps) {
  const { disabled = false, id, isFlipped, isMatched, value, onClick, ...otherProps } = props;

  return (
    <button
      className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={() => onClick(id)}
      disabled={disabled || isFlipped || isMatched}
      {...otherProps}
    >
      <div className="card-inner">
        <div className="card-back">?</div>
        <div className="card-front">{value}</div>
      </div>
    </button>
  );
}

export type { CardProps };
export default Card;
