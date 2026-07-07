import { useState } from "react";
import { Button } from "../Components/UI/Button/Button";
import { Input } from "../Components/UI/Input/Input";
import { Counter } from "../Components/UI/Counter/Counter";
import { Checkbox } from "../Components/UI/Checkbox/Checkbox";
import { DialogBox } from "../Components/UI/DialogBox/DialogBox";
import { Select } from "../Components/UI/Select/Select";
import { Toggle } from "../Components/UI/Toggle/Toggle";
import { Slider } from "../Components/UI/Slider/Slider";
import { Rating } from "../Components/UI/Rating/Rating";
import { useAuth } from "../hooks/useAuth";

function Testing() {
  const [count, setCount] = useState(1);
  const [checked, setChecked] = useState(false);
  const [time, setTime] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [price, setPrice] = useState(500);
  const [rating, setRating] = useState(0);
  const { user, logout } = useAuth();

  return (
    <>
      <div>
        <h1>{user ? "Authorized" : "Unauthorized"}</h1>
      </div>
      <Button onClick={logout}>logout</Button>
      <Input label="Телефон" placeholder="+7 (999) 999-99-99" />
      <Counter value={count} onChange={setCount} min={1} max={10} />
      <Checkbox
        label="Позвонить, когда заказ будет готов"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <DialogBox>
        <p>Вы уверены, что хотите удалить этот элемент?</p>
      </DialogBox>
      <Select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="Выберите время"
        options={[
          { value: "18:00", label: "18:00" },
          { value: "18:30", label: "18:30" },
          { value: "19:00", label: "19:00" },
        ]}
      />
      <Toggle
        label="Получать уведомления"
        checked={notifications}
        onChange={(e) => setNotifications(e.target.checked)}
      />
      <Slider
        label="Максимальная цена"
        value={price}
        min={0}
        max={3000}
        step={1}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <Rating value={rating} onChange={setRating} />
    </>
  );
}

export default Testing;
