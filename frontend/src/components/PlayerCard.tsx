import { useState } from "react";
import type { Player } from "../types";
import styles from "./PlayerCard.module.css";

interface PlayerCardProps {
  player: Player;
  quantity?: number;
  faltando?: boolean;
  accent?: string;
}

function iniciais(nome: string) {
  return nome
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PlayerCard({ player, quantity, faltando, accent }: PlayerCardProps) {
  const [erroFoto, setErroFoto] = useState(false);
  const mostrarFoto = player.photo && !erroFoto;

  return (
    <div
      className={`${styles.card} ${faltando ? styles.faltando : ""}`}
      style={accent ? { borderTop: `4px solid ${accent}` } : undefined}
    >
      {quantity !== undefined && quantity > 1 && (
        <span className={styles.badge}>x{quantity}</span>
      )}
      <div className={styles.fotoWrap}>
        {mostrarFoto ? (
          <img
            src={player.photo!}
            alt={player.name}
            className={styles.foto}
            loading="lazy"
            onError={() => setErroFoto(true)}
          />
        ) : (
          <div className={styles.iniciais}>{iniciais(player.name)}</div>
        )}
      </div>
      <div className={styles.info}>
        <strong className={styles.nome}>{player.name}</strong>
        <span className={styles.time}>{player.team}</span>
        {player.position && <span className={styles.posicao}>{player.position}</span>}
      </div>
    </div>
  );
}