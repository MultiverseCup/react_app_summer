import { useState } from "react";
import { menuItems } from "../../../data/menuData";
import { MenuCard } from "../MenuCard/MenuCard";
import styles from "./MenuGrid.module.scss";

const categories = [
  { key: "all", label: "Все" },
  { key: "shaurma", label: "Шаурма" },
  { key: "burgers", label: "Бургеры" },
  { key: "drinks", label: "Напитки" },
  { key: "snacks", label: "Закуски" },
];

export const MenuGrid = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`${styles.tab} ${activeCategory === cat.key ? styles.active : ""}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {filteredItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};
