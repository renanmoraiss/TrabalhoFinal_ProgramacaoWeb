import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Cadastro } from "./pages/Cadastro";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace/>} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<PrivateRoute> <Home /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;