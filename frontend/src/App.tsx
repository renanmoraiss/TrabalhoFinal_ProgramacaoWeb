import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Cadastro } from "./pages/Cadastro";
import { Login } from "./pages/Login";
import { PrivateRoute } from "./routes/PrivateRoute";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Catalogo } from "./pages/Catalogo";
import { Pacotes } from "./pages/Pacotes";
import { Inventario } from "./pages/Inventario";
import { Album } from "./pages/Album";
import { Colecoes } from "./pages/Colecoes";
import { ColecaoDetalhe } from "./pages/ColecaoDetalhe";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/pacotes" element={<Pacotes />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/album" element={<Album />} />
          <Route path="/colecoes" element={<Colecoes />} />
          <Route path="/colecoes/:id" element={<ColecaoDetalhe />} />
          {/* próximas telas: /pacotes, /inventario, /album, /colecoes */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;