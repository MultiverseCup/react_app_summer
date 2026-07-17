import { createContext, useContext, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface AuthContextType {
  isLogged: boolean;
  username: string | null;
  token: string | null;
  role: "user" | "guest";
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
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem("username"),
  );
  const [isLogged, setIsLogged] = useState<boolean>(
    () => localStorage.getItem("isLogged") === "true",
  );

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Ошибка входа");

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("isLogged", "true");
    setToken(data.token);
    setUsername(data.username);
    setIsLogged(true);
  };

  const register = async (email: string, password: string) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Ошибка регистрации");

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("isLogged", "true");
    setToken(data.token);
    setUsername(data.username);
    setIsLogged(true);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    localStorage.removeItem("isLogged");
    setToken(null);
    setUsername(null);
    setIsLogged(false);
  };

  const role: "user" | "guest" = isLogged ? "user" : "guest";

  return (
    <AuthContext.Provider
      value={{ isLogged, username, token, role, login, register, logout }}
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

// Компонент для защиты маршрутов
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLogged } = useAuth();
  if (!isLogged) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
