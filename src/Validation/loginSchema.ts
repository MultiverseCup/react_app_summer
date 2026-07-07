import * as yup from "yup"

export const loginSchema = yup.object({
    email: yup
    .string()
    .required("Введите email")
    .email("Введите корректный email"),

    password: yup
    .string()
    .required("Введите пароль")
    .min(6, "Минимум 6 символов")
}) 