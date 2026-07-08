import { MenuGrid } from "../../Components/Menu/MenuGrid/MenuGrid";
import styles from "./HomePage.module.scss";

export const HomePage = () => {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Шаурма & Бургеры</h1>
        <p className={styles.subtitle}>
          Горячие, сочные, с доставкой или самовывозом
        </p>
      </section>
      <section className={styles.menuSection}>
        <h2 className={styles.menuHeading}>Меню</h2>
        <MenuGrid />
      </section>
    </main>
  );
};
