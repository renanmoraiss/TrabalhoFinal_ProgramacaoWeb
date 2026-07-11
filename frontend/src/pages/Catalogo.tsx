import { useEffect, useState } from "react";
import { api } from "../Services/api";
import type { Player } from "../types";
import { PlayerCard } from "../components/PlayerCard";
import styles from "./Catalogo.module.css";

export function Catalogo() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [time, setTime] = useState("todos");

  useEffect(() => {
    api
      .get<Player[]>("/players")
      .then((r) => setPlayers(r.data))
      .catch(() => setErro("Erro ao carregar o catálogo."))
      .finally(() => setCarregando(false));
  }, []);

  const times = ["todos", ...Array.from(new Set(players.map((p) => p.team))).sort()];
  const filtrados = time === "todos" ? players : players.filter((p) => p.team === time);

  if (carregando) return <p>Carregando catálogo...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div>
      <div className={styles.topo}>
        <h1>
          Catálogo <span className={styles.contador}>{filtrados.length}</span>
        </h1>
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
        {filtrados.map((p) => (
          <PlayerCard key={p.id} player={p} />
        ))}
      </div>
    </div>
  );
}