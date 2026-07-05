import styles from "./Styles.module.scss";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const Counter = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
}: CounterProps) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className={styles.counter}>
      <button
        className={styles.button}
        onClick={decrement}
        disabled={value <= min}
      >
        −
      </button>

      <span className={styles.value}>{value}</span>

      <button
        className={styles.button}
        onClick={increment}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};
