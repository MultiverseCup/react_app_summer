import { createContext, useContext, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  isLogged: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("auth_token"),
  );
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const isLogged = !!user && !!token;

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Ошибка входа");

    // Определяем роль по имени (только для учебного проекта)
    const role = data.username === "admin" ? "admin" : "user";
    const userData: User = {
      id: email.toLowerCase(), // постоянный ID на основе email
      username: data.username,
      email: email,
      role: data.username === "admin" ? "admin" : "user",
    };

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
  };

  const register = async (email: string, password: string) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Ошибка регистрации");

    const userData: User = {
      id: email.toLowerCase(),
      username: data.username,
      email: email,
      role: data.username === "admin" ? "admin" : "user",
    };

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isLogged, user, token, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLogged } = useAuth();
  if (!isLogged) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
