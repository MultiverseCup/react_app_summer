import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../Validation/registerSchema";
import { Input } from "../Components/UI/Input/Input";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import type { InferType } from "yup";
import styles from "./LoginPage.module.scss";
import { Button } from "../Components/UI/Button/Button";

type RegisterForm = InferType<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null);
      await registerUser(data.email, data.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.loginTitle}>Регистрация</h1>
      <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          placeholder="example@email.com"
          {...register("email")}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
        <Input
          className={styles.authInput}
          label="Пароль"
          type="password"
          placeholder="Пароль"
          {...register("password")}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
        <Input
          className={styles.authInput}
          label="Подтверждение пароля"
          type="password"
          placeholder="Повторите пароль"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword.message}</span>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit">Зарегистрироваться</Button>
      </form>
      <p className={styles.loginText}>
        Уже есть аккаунт? <a href="/login">Войти</a>
      </p>
    </div>
  );
};
