import type { SelectHTMLAttributes } from "react";
import styles from "./Select.module.scss";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> {
  options: Option[];
  placeholder?: string;
}

export const Select = ({
  options,
  placeholder,
  className,
  ...props
}: SelectProps) => {
  return (
    <select className={`${styles.select} ${className ?? ""}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
