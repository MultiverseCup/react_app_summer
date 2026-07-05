import type { InputHTMLAttributes } from "react";
import styles from "./Slider.module.scss";

interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

export const Slider = ({
  label,
  value,
  min = 0,
  max = 100,
  className,
  ...props
}: SliderProps) => {
  return (
    <div className={`${styles.slider} ${className ?? ""}`}>
      {label && (
        <div className={styles.header}>
          <span>{label}</span>
          <span>{value}</span>
        </div>
      )}

      <input
        className={styles.input}
        type="range"
        value={value}
        min={min}
        max={max}
        {...props}
      />
    </div>
  );
};
