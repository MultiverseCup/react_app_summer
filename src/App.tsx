import { Route, Routes } from "react-router-dom";
import Testing from "./Pages/TestingPage";
import { LoginPage } from "./Pages/LoginPage";
import { useAuth } from "./hooks/useAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Testing />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
