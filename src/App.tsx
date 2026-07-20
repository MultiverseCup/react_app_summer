import { Routes, Route } from "react-router-dom";
import { Layout } from "./Components/Layout/Layout";
import { HomePage } from "./Pages/HomePage/HomePage";
import { LoginPage } from "./Pages/LoginPage";
import { RegisterPage } from "./Pages/RegisterPage";
import { CartPage } from "./Pages/CartPage/CartPage";
import { ProtectedRoute } from "./Contexts/AuthContext";
import { RequireAdmin } from "./Components/RequireAdmin";
import { AdminOrdersPage } from "./Pages/AdminOrdersPage/AdminOrdersPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="menu" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <RequireAdmin>
                <AdminOrdersPage />
              </RequireAdmin>
            </ProtectedRoute>
          }
        />
        <Route path="register" element={<RegisterPage />} />{" "}
        <Route path="*" element={<div>Страница не найдена</div>} />
      </Route>
    </Routes>
  );
}

export default App;
