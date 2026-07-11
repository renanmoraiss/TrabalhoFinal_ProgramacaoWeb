import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../Services/api";
import type { UserSticker } from "../types";
import { PlayerCard } from "../components/PlayerCard";
import styles from "./Inventario.module.css";

export function Inventario() {
  const [stickers, setStickers] = useState<UserSticker[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [time, setTime] = useState("todos");

  useEffect(() => {
    api
      .get<UserSticker[]>("/stickers/me")
      .then((r) => setStickers(r.data))
      .catch(() => setErro("Erro ao carregar o inventário."))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p>Carregando inventário...</p>;
  if (erro) return <p>{erro}</p>;

  if (stickers.length === 0) {
    return (
      <div className={styles.vazio}>
        <div className={styles.icone}>📭</div>
        <h1>Inventário vazio</h1>
        <p>Você ainda não tem figurinhas.</p>
        <Link to="/pacotes" className={styles.botao}>Abrir um pacote</Link>
      </div>
    );
  }

  const totalFigurinhas = stickers.reduce((soma, s) => soma + s.quantity, 0);
  const times = ["todos", ...Array.from(new Set(stickers.map((s) => s.player.team))).sort()];
  const filtrados =
    time === "todos" ? stickers : stickers.filter((s) => s.player.team === time);

  return (
    <div>
      <div className={styles.topo}>
        <div>
          <h1>Meu Inventário</h1>
          <p className={styles.stats}>
            <strong>{stickers.length}</strong> jogadores diferentes ·{" "}
            <strong>{totalFigurinhas}</strong> figurinhas no total
          </p>
        </div>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={styles.select}
        >
          {times.map((t) => (
            <option key={t} value={t}>
              {t === "todos" ? "Todas as seleções" : t}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {filtrados.map((s) => (
          <PlayerCard key={s.id} player={s.player} quantity={s.quantity} />
        ))}
      </div>
    </div>
  );
}