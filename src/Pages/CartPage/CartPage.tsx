import { useState, useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { Button } from "../../Components/UI/Button/Button";
import styles from "./CartPage.module.scss";
import { OrderModal } from "../../Components/OrderModal";
import { PREPARATION_TIME_MINUTES } from "../../config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

type OrderStatus = "idle" | "ordering" | "ordered" | "ready";

export const CartPage = () => {
  const navigate = useNavigate();
  const { isLogged } = useAuth();
  const { items, orderActive, activateOrder, completeOrder, totalPrice } =
    useCart();

  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // При монтировании проверяем, был ли активный заказ
  useEffect(() => {
    if (orderActive) {
      const savedOrderTime = localStorage.getItem("orderTime");
      if (savedOrderTime) {
        const orderTime = new Date(savedOrderTime).getTime();
        const now = Date.now();
        const elapsedMs = now - orderTime;
        const totalMs = PREPARATION_TIME_MINUTES * 60 * 1000;
        const remainingMs = Math.max(totalMs - elapsedMs, 0);
        const remainingMin = Math.ceil(remainingMs / 60000);
        if (remainingMin > 0) {
          setOrderStatus("ordered");
          setTimeLeft(remainingMin);
        } else {
          setOrderStatus("ready");
        }
      } else {
        // Если orderActive, но нет orderTime (редкий случай) – создадим
        localStorage.setItem("orderTime", new Date().toISOString());
        setOrderStatus("ordered");
        setTimeLeft(PREPARATION_TIME_MINUTES);
      }
    }
  }, [orderActive]);

  // Таймер в минутах
  useEffect(() => {
    if (orderStatus !== "ordered") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOrderStatus("ready");
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // раз в минуту
    return () => clearInterval(interval);
  }, [orderStatus]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!isLogged) {
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const handleOrderSubmit = () => {
    const orderTime = new Date().toISOString();
    localStorage.setItem("orderTime", orderTime);
    activateOrder();
    setOrderStatus("ordered");
    setTimeLeft(PREPARATION_TIME_MINUTES);
    setShowModal(false);
  };

  const handlePickup = () => {
    completeOrder();
    localStorage.removeItem("orderTime");
    setOrderStatus("idle");
  };

  if (items.length === 0 && !orderActive) {
    return (
      <div className={styles.container}>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из меню</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Корзина</h1>

      {/* Список товаров всегда виден, если корзина не пуста */}
      {items.length > 0 && (
        <div className={styles.itemList}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.itemImage}
              />
              <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                <p>{item.price} ₽</p>
              </div>
              <div className={styles.itemTotal}>
                {item.price * item.quantity} ₽
              </div>
            </div>
          ))}
        </div>
      )}

      {orderStatus === "ordered" && (
        <div className={styles.timerSection}>
          <p>Заказ будет готов через: {timeLeft} мин.</p>
        </div>
      )}

      {orderStatus === "ready" && (
        <div className={styles.readySection}>
          <p>Заказ готов!</p>
          <p>Вы забрали заказ?</p>
          <Button onClick={handlePickup}>Да, забрал</Button>
        </div>
      )}

      {!orderActive && items.length > 0 && (
        <>
          <div className={styles.deliveryOptions}>
            <button className={`${styles.optionBtn} ${styles.active}`}>
              Самовывоз
            </button>
            <button className={styles.optionBtn} disabled>
              Доставка (недоступно)
            </button>
          </div>
          <div className={styles.summary}>
            <span>Итого:</span>
            <span className={styles.totalPrice}>{totalPrice} ₽</span>
          </div>
          <Button onClick={handleCheckout}>Оформить заказ</Button>
        </>
      )}

      {showModal && (
        <OrderModal
          onClose={() => setShowModal(false)}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
};
