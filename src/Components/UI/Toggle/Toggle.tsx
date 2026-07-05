import type { InputHTMLAttributes } from "react";
import styles from "./Toggle.module.scss";

interface ToggleProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}
export const Toggle = ({
  label,
  checked,
  onChange,
  className,
  ...props
}: ToggleProps) => {
  return (
    <label className={`${styles.toggle} ${className ?? ""}`}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        {...props}
      />

      <span className={styles.slider}></span>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
