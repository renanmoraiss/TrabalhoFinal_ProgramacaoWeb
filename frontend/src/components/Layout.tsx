import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";

export function Layout() {
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? styles.ativo : "";

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.marca}>
          <img src="/Logo.jpg" alt="Logo" className={styles.logo} />
          <span>Copa Album</span>
        </div>
        <nav className={styles.nav}>
          <NavLink to="/home" className={linkClass}>Início</NavLink>
          <NavLink to="/catalogo" className={linkClass}>Catálogo</NavLink>
          <NavLink to="/pacotes" className={linkClass}>Pacotes</NavLink>
          <NavLink to="/inventario" className={linkClass}>Inventário</NavLink>
          <NavLink to="/album" className={linkClass}>Álbum</NavLink>
          <NavLink to="/colecoes" className={linkClass}>Coleções</NavLink>
        </nav>
        <button className={styles.sair} onClick={sair}>Sair</button>
      </header>
      <main className={styles.conteudo}>
        <Outlet />
      </main>
    </div>
  );
}