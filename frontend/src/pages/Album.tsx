import { useEffect, useMemo, useState } from "react";
import { api } from "../Services/api";
import type { Player, UserSticker } from "../types";
import { PlayerCard } from "../components/PlayerCard";
import { corDoTime } from "../teamColors";
import styles from "./Album.module.css";

export function Album() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stickers, setStickers] = useState<UserSticker[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [timeSelecionado, setTimeSelecionado] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<Player[]>("/players"),
      api.get<UserSticker[]>("/stickers/me"),
    ])
      .then(([resPlayers, resStickers]) => {
        setPlayers(resPlayers.data);
        setStickers(resStickers.data);
      })
      .catch(() => setErro("Erro ao carregar o álbum."))
      .finally(() => setCarregando(false));
  }, []);

  const quantidadePorPlayer = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const s of stickers) mapa.set(s.playerId, s.quantity);
    return mapa;
  }, [stickers]);

  const times = useMemo(
    () => Array.from(new Set(players.map((p) => p.team))).sort(),
    [players]
  );

  useEffect(() => {
    if (!timeSelecionado && times.length > 0) {
      setTimeSelecionado(times[0]);
    }
  }, [times, timeSelecionado]);

  if (carregando) return <p>Carregando álbum...</p>;
  if (erro) return <p>{erro}</p>;

  const totalJogadores = players.length;
  const totalPossuidos = players.filter((p) => quantidadePorPlayer.has(p.id)).length;
  const percentGeral =
    totalJogadores > 0 ? Math.round((totalPossuidos / totalJogadores) * 100) : 0;

  const jogadoresDoTime = players.filter((p) => p.team === timeSelecionado);
  const possuidosDoTime = jogadoresDoTime.filter((p) =>
    quantidadePorPlayer.has(p.id)
  ).length;
  const percentTime =
    jogadoresDoTime.length > 0
      ? Math.round((possuidosDoTime / jogadoresDoTime.length) * 100)
      : 0;
  const corTime = corDoTime(timeSelecionado);

  return (
    <div>
      <div className={styles.cabecalho}>
        <h1>Álbum</h1>
        <p className={styles.resumoGeral}>
          Completude geral:{" "}
          <strong>
            {totalPossuidos}/{totalJogadores}
          </strong>{" "}
          ({percentGeral}%)
        </p>
        <div className={styles.barra}>
          <div className={styles.progresso} style={{ width: `${percentGeral}%` }} />
        </div>
      </div>

      <div className={styles.times}>
        {times.map((t) => {
          const jog = players.filter((p) => p.team === t);
          const pos = jog.filter((p) => quantidadePorPlayer.has(p.id)).length;
          const completo = jog.length > 0 && pos === jog.length;
          const cor = corDoTime(t);
          return (
            <button
              key={t}
              className={`${styles.chip} ${t === timeSelecionado ? styles.chipAtivo : ""} ${completo ? styles.chipCompleto : ""}`}
              style={
                t === timeSelecionado
                  ? { borderColor: cor, boxShadow: `0 0 0 2px ${cor}44` }
                  : undefined
              }
              onClick={() => setTimeSelecionado(t)}
            >
              <span className={styles.dot} style={{ background: cor }} />
              {t} <span className={styles.chipContagem}>{pos}/{jog.length}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.tituloTime} style={{ borderLeftColor: corTime }}>
        <h2>{timeSelecionado}</h2>
        <span className={styles.percentTime} style={{ color: corTime }}>
          {possuidosDoTime}/{jogadoresDoTime.length} ({percentTime}%)
        </span>
      </div>
      <div className={styles.barraTime}>
        <div
          className={styles.progressoTime}
          style={{ width: `${percentTime}%`, background: corTime }}
        />
      </div>

      <div className={styles.grid}>
        {jogadoresDoTime.map((p) => {
          const qtd = quantidadePorPlayer.get(p.id);
          return (
            <PlayerCard
              key={p.id}
              player={p}
              quantity={qtd}
              faltando={qtd === undefined}
              accent={qtd === undefined ? undefined : corTime}
            />
          );
        })}
      </div>
    </div>
  );
}