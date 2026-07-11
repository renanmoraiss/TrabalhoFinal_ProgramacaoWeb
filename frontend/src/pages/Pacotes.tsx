import { useState } from "react";
import { api } from "../Services/api";
import type { Player } from "../types";
import { PlayerCard } from "../components/PlayerCard";
import styles from "./Pacotes.module.css";

export function Pacotes() {
  const [figurinhas, setFigurinhas] = useState<Player[]>([]);
  const [abrindo, setAbrindo] = useState(false);
  const [erro, setErro] = useState("");

  async function abrirPacote() {
    setErro("");
    setAbrindo(true);
    setFigurinhas([]);
    try {
      const r = await api.post<{ opened: number; figurinhas: Player[] }>("/packs/open");
      setFigurinhas(r.data.figurinhas);
    } catch {
      setErro("Erro ao abrir o pacote. Verifique se você está logado.");
    } finally {
      setAbrindo(false);
    }
  }

  return (
    <div>
      <div className={`${styles.hero} ${figurinhas.length === 0 ? styles.heroCheio : ""}`}>
        <div className={styles.pacoteIcone}>🎴</div>
        <h1 className={styles.titulo}>Abrir Pacote</h1>
        <p className={styles.sub}>
          Cada pacote traz 5 figurinhas aleatórias da Copa. Repetidas viram
          quantidade no seu inventário.
        </p>
        <button className={styles.botao} onClick={abrirPacote} disabled={abrindo}>
          {abrindo
            ? "Abrindo..."
            : figurinhas.length > 0
            ? "🎴 Abrir outro pacote"
            : "🎴 Abrir pacote"}
        </button>
        {erro && <p className={styles.erro}>{erro}</p>}
      </div>

      {figurinhas.length > 0 && (
        <div className={styles.resultado}>
          <div className={styles.grid}>
            {figurinhas.map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                className={styles.reveal}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <PlayerCard player={p} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}