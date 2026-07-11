import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../Services/api";
import type { CollectionDetail, UserSticker } from "../types";
import { PlayerCard } from "../components/PlayerCard";
import { corDoTime } from "../teamColors";
import styles from "./ColecaoDetalhe.module.css";

export function ColecaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [colecao, setColecao] = useState<CollectionDetail | null>(null);
  const [inventario, setInventario] = useState<UserSticker[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [selecionado, setSelecionado] = useState("");

  const carregar = useCallback(() => {
    if (!id) return;
    Promise.all([
      api.get<CollectionDetail>(`/collections/${id}`),
      api.get<UserSticker[]>("/stickers/me"),
    ])
      .then(([resCol, resInv]) => {
        setColecao(resCol.data);
        setInventario(resInv.data);
      })
      .catch(() => setErro("Erro ao carregar a coleção."))
      .finally(() => setCarregando(false));
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function adicionar() {
    if (!id || !selecionado) return;
    setErro("");
    try {
      await api.post(`/collections/${id}/stickers`, { userStickerId: selecionado });
      setSelecionado("");
      carregar();
    } catch {
      setErro("Não foi possível adicionar a figurinha.");
    }
  }

  async function remover(userStickerId: string) {
    if (!id) return;
    try {
      await api.delete(`/collections/${id}/stickers/${userStickerId}`);
      carregar();
    } catch {
      setErro("Não foi possível remover a figurinha.");
    }
  }

  if (carregando) return <p>Carregando coleção...</p>;
  if (!colecao) return <p>{erro || "Coleção não encontrada."}</p>;

  const jaNaColecao = new Set(colecao.items.map((it) => it.userStickerId));
  const disponiveis = inventario.filter((s) => !jaNaColecao.has(s.id));

  return (
    <div>
      <Link to="/colecoes" className={styles.voltar}>← Coleções</Link>
      <h1 className={styles.titulo}>{colecao.name}</h1>

      <div className={styles.adicionar}>
        <select
          className={styles.select}
          value={selecionado}
          onChange={(e) => setSelecionado(e.target.value)}
        >
          <option value="">
            {disponiveis.length > 0
              ? "Escolha uma figurinha do inventário..."
              : "Nenhuma figurinha disponível para adicionar"}
          </option>
          {disponiveis.map((s) => (
            <option key={s.id} value={s.id}>
              {s.player.name} — {s.player.team}
            </option>
          ))}
        </select>
        <button className={styles.botaoAdd} onClick={adicionar} disabled={!selecionado}>
          Adicionar
        </button>
      </div>

      {erro && <p className={styles.erro}>{erro}</p>}

      {colecao.items.length === 0 ? (
        <p className={styles.vazio}>Esta coleção ainda está vazia. Adicione figurinhas acima.</p>
      ) : (
        <div className={styles.grid}>
          {colecao.items.map((it) => (
            <div key={it.id} className={styles.item}>
              <PlayerCard
                player={it.userSticker.player}
                quantity={it.userSticker.quantity}
                accent={corDoTime(it.userSticker.player.team)}
              />
              <button
                className={styles.botaoRemover}
                onClick={() => remover(it.userStickerId)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}