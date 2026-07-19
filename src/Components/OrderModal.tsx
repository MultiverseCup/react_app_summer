import { useState } from "react";
import styles from "./OrderModal.module.scss";

interface OrderModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

export const OrderModal = ({ onClose, onSubmit }: OrderModalProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<{
    card?: string;
    expiry?: string;
    cvv?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, "")))
      newErrors.card = "Введите 16 цифр номера карты";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) newErrors.expiry = "Формат MM/YY";
    if (!/^\d{3}$/.test(cvv)) newErrors.cvv = "Введите 3 цифры CVV";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Данные банковской карты</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Номер карты
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            {errors.card && <span className={styles.error}>{errors.card}</span>}
          </label>
          <div className={styles.row}>
            <label>
              Срок действия
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiry && (
                <span className={styles.error}>{errors.expiry}</span>
              )}
            </label>
            <label>
              CVV
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength={3}
              />
              {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
            </label>
          </div>
          <div className={styles.buttons}>
            <button type="button" onClick={onClose}>
              Отмена
            </button>
            <button type="submit">Оплатить</button>
          </div>
        </form>
      </div>
    </div>
  );
};
