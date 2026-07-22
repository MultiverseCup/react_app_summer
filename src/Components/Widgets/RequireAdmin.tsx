import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
};
