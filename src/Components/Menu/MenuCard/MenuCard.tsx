import type { MenuItem } from "../../../types/menu";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../hooks/useAuth";
import { getActiveOrderForUser } from "../../../utils/localData";
import { Button } from "../../UI/Button/Button";
import styles from "./MenuCard.module.scss";

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard = ({ item }: MenuCardProps) => {
  const { addItem, items, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();

  const cartItem = items.find((i) => i.id === item.id);

  // Проверяем, есть ли активный заказ у текущего пользователя
  const hasActiveOrder = user
    ? getActiveOrderForUser(user.email) !== null
    : false;
  const handleAdd = () => addItem(item);
  const handleIncrement = () => {
    if (cartItem) updateQuantity(item.id, cartItem.quantity + 1);
  };
  const handleDecrement = () => {
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(item.id, cartItem.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={item.image}
          alt={item.name}
          className={styles.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "./images/favicon.svg";
          }}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{item.name}</h3>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.bottom}>
          <span className={styles.price}>{item.price} ₽</span>
          {hasActiveOrder ? (
            <span className={styles.locked}>Заказ оформлен</span>
          ) : !cartItem ? (
            <Button onClick={handleAdd}>В корзину</Button>
          ) : (
            <div className={styles.counterControls}>
              <button className={styles.controlBtn} onClick={handleDecrement}>
                −
              </button>
              <span className={styles.quantity}>{cartItem.quantity}</span>
              <button className={styles.controlBtn} onClick={handleIncrement}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
