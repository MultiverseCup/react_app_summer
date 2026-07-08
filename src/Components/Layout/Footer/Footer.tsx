import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.contacts}>
          <h3>Контакты</h3>
          <p>📞 +7(999)-999-99-99</p>
          <p>✉️ shaurma@example.com</p>
        </div>
        <button className={styles.reviewButton}>Оставить отзыв</button>
      </div>
    </footer>
  );
};
