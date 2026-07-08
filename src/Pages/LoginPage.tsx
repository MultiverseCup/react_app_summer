import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { loginSchema } from "../Validation/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import styles from "./LoginPage.module.scss";
import * as yup from "yup";
import { Input } from "../Components/UI/Input/Input";
import { useAuth } from "../hooks/useAuth";

export const LoginPage = () => {
  const schema = loginSchema;
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: yup.InferType<typeof loginSchema>) => {
    login({
      email: data.email,
    });

    navigate("/");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <span>Email</span>
        <Input {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
        <br></br>
        <span>Password</span>
        <Input {...register("password")} type="password" />
        {errors.password && <span>{errors.password.message}</span>}
        <br></br>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};
