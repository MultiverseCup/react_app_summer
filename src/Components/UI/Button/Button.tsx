import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: "purple" | "white";
}

export const Button = ({
  children,
  className,
  color,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${className ?? ""} ${color ? styles[`button__${color}`] : ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
