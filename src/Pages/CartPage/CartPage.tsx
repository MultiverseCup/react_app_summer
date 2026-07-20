import { useState, useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { Button } from "../../Components/UI/Button/Button";
import styles from "./CartPage.module.scss";
import { OrderModal } from "../../Components/OrderModal";
import { PREPARATION_TIME_MINUTES } from "../../config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import {
  addOrder,
  getActiveOrderForUser,
  updateOrderStatus,
  type Order,
} from "../../utils/localData";

export const CartPage = () => {
  const navigate = useNavigate();
  const { user, isLogged } = useAuth();
  const { items, clearCart, totalPrice } = useCart();

  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Восстановление активного заказа по email пользователя
  useEffect(() => {
    if (!user?.email) {
      setActiveOrder(null);
      return;
    }
    const existing = getActiveOrderForUser(user.email);
    if (existing) {
      setActiveOrder(existing);
      if (existing.status === "active") {
        const elapsed = Date.now() - new Date(existing.orderTime).getTime();
        const remaining = Math.max(
          PREPARATION_TIME_MINUTES * 60 * 1000 - elapsed,
          0,
        );
        setTimeLeft(Math.ceil(remaining / 60000));
      }
    }
  }, [user]);

  // Таймер обратного отсчёта
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== "active") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, [activeOrder]);

  // Опрос статуса заказа (реакция на действия админа)
  useEffect(() => {
    if (!activeOrder || activeOrder.status === "completed" || !user?.email)
      return;
    const interval = setInterval(() => {
      const order = getActiveOrderForUser(user.email);
      if (order && order.status !== activeOrder.status) {
        setActiveOrder(order);
        if (order.status === "ready") setTimeLeft(0);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [activeOrder, user]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!isLogged || !user) {
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const handleOrderSubmit = () => {
    if (!user) return;
    const newOrder: Order = {
      id: Date.now().toString(),
      userId: user.email, // ← используем email как идентификатор
      items: [...items],
      totalPrice,
      orderTime: new Date().toISOString(),
      status: "active",
    };
    addOrder(newOrder);
    clearCart();
    setActiveOrder(newOrder);
    setTimeLeft(PREPARATION_TIME_MINUTES);
    setShowModal(false);
  };

  const handlePickup = () => {
    if (activeOrder) {
      updateOrderStatus(activeOrder.id, "completed");
      setActiveOrder(null);
    }
  };

  // Отображение активного заказа
  if (activeOrder) {
    return (
      <div className={styles.container}>
        <h1>Корзина</h1>
        <div className={styles.itemList}>
          {activeOrder.items.map((item) => (
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
        {activeOrder.status === "active" && (
          <div className={styles.timerSection}>
            <p>Заказ будет готов через: {timeLeft} мин.</p>
          </div>
        )}
        {activeOrder.status === "ready" && (
          <div className={styles.readySection}>
            <p>Заказ готов!</p>
            <p>Вы забрали заказ?</p>
            <Button onClick={handlePickup}>Да, забрал</Button>
          </div>
        )}
        {activeOrder.status === "completed" && <p>Заказ завершён. Спасибо!</p>}
      </div>
    );
  }

  // Пустая корзина
  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из меню</p>
      </div>
    );
  }

  // Обычная корзина
  return (
    <div className={styles.container}>
      <h1>Корзина</h1>
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
      {showModal && (
        <OrderModal
          onClose={() => setShowModal(false)}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
};
