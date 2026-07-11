import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const atalhos = [
  { to: "/catalogo", titulo: "Catálogo", desc: "Veja todos os jogadores da Copa 2022." },
  { to: "/pacotes", titulo: "Abrir Pacotes", desc: "Abra pacotes e ganhe figurinhas." },
  { to: "/inventario", titulo: "Meu Inventário", desc: "As figurinhas que você já tem." },
  { to: "/album", titulo: "Álbum do Brasil", desc: "Complete o álbum da seleção." },
  { to: "/colecoes", titulo: "Coleções", desc: "Monte suas próprias coleções." },
];

export function Home() {
  return (
    <div>
      <h1 className={styles.titulo}>O sonho do Hexa 🏆</h1>
      <p className={styles.sub}>Abra pacotes, colecione craques e complete o álbum.</p>
      <div className={styles.grid}>
        {atalhos.map((a) => (
          <Link key={a.to} to={a.to} className={styles.card}>
            <strong>{a.titulo}</strong>
            <span>{a.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}