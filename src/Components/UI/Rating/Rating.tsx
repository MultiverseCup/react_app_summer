import { useState } from "react";
import styles from "./Rating.module.scss";

interface RatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export const Rating = ({
  value,
  max = 5,
  onChange,
  readOnly = false,
}: RatingProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (readOnly) return;
    onChange?.(index);
  };

  return (
    <div className={styles.rating}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;

        const isFilled =
          hoverValue !== null ? starValue <= hoverValue : starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            className={`${styles.star} ${isFilled ? styles.filled : ""}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => !readOnly && setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
            disabled={readOnly}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};
