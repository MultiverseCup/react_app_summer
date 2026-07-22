import * as yup from "yup";

export const registerSchema = yup.object({
  email: yup.string()
    .required("Введите email")
    .email("Некорректный email"),
  password: yup.string()
    .required("Введите пароль")
    .min(3, "Минимум 3 символа"),
  confirmPassword: yup.string()
    .required("Подтвердите пароль")
    .oneOf([yup.ref("password")], "Пароли должны совпадать"),
});