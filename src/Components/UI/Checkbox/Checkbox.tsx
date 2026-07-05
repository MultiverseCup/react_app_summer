import type { InputHTMLAttributes } from "react";
import styles from "./Styles.module.scss";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

export const Checkbox = ({
  label,
  checked,
  onChange,
  ...props
}: CheckboxProps) => {
  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        {...props}
      />

      <span className={styles.box}></span>

      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
