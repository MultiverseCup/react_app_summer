import styles from "./DialogBox.module.scss";
import { Button } from "../Button/Button";

interface DialogBoxProps {
  children: React.ReactNode;
}

export const DialogBox = ({ children }: DialogBoxProps) => {
  return (
    <div className={styles.dialogBox}>
      <div className={styles.dialogBoxText}>{children}</div>
      <div className={styles.dialogBoxButtons}>
        <Button className={styles.dialogBoxButton}>Да</Button>
        <Button className={styles.dialogBoxButton} color="white">
          Нет
        </Button>
      </div>
    </div>
  );
};
