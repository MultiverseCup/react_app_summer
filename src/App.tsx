import { Routes, Route } from "react-router-dom";
import { Layout } from "./Components/Layout/Layout";
import { HomePage } from "./Pages/HomePage/HomePage";
import { LoginPage } from "./Pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<HomePage />} />{" "}
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<div>Страница не найдена</div>} />
      </Route>
    </Routes>
  );
}

export default App;
