import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../Validation/loginSchema";
import { Input } from "../Components/UI/Input/Input";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import type { InferType } from "yup";
import styles from "./LoginPage.module.scss";
import { Button } from "../Components/UI/Button/Button";

type LoginForm = InferType<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      await login(data.email, data.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Ошибка входа");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.loginTitle}>Вход</h1>
      <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
        <Input
          className={styles.authInput}
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
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit">Войти</Button>
      </form>
      <p className={styles.loginText}>
        Нет аккаунта? <a href="/register">Зарегистрироваться</a>
      </p>
    </div>
  );
};
