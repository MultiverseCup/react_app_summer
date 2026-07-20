import { useState, useEffect } from "react";
import {
  getOrders,
  updateOrderStatus,
  type Order,
} from "../../utils/localData";
import { Button } from "../../Components/UI/Button/Button";
import styles from "./AdminOrdersPage.module.scss";

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const refresh = () => setOrders(getOrders());

  const handleMarkReady = (orderId: string) => {
    updateOrderStatus(orderId, "ready");
    refresh();
  };

  const statusText = (status: Order["status"]) => {
    if (status === "active") return "Готовится";
    if (status === "ready") return "Готов";
    if (status === "completed") return "Завершён";
    return status;
  };

  return (
    <div className={styles.container}>
      <h1>Все заказы (админ)</h1>
      <Button onClick={refresh}>Обновить</Button>
      {orders.length === 0 ? (
        <p className={styles.empty}>Нет заказов</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Пользователь</th>
              <th>Сумма</th>
              <th>Дата</th>
              <th>Статус</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>{order.totalPrice} ₽</td>
                <td>{new Date(order.orderTime).toLocaleString("ru")}</td>
                <td className={styles[`status-${order.status}`]}>
                  {statusText(order.status)}
                </td>
                <td>
                  {order.status === "active" && (
                    <Button onClick={() => handleMarkReady(order.id)}>
                      Отметить готовым
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
