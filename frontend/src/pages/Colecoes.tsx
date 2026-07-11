import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../Services/api";
import type { Collection } from "../types";
import styles from "./Colecoes.module.css";

export function Colecoes() {
  const [colecoes, setColecoes] = useState<Collection[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");

  function carregar() {
    api
      .get<Collection[]>("/collections")
      .then((r) => setColecoes(r.data))
      .catch(() => setErro("Erro ao carregar coleções."))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar(event: React.FormEvent) {
    event.preventDefault();
    setErro("");
    const nome = novoNome.trim();
    if (!nome) return;
    try {
      await api.post("/collections", { name: nome });
      setNovoNome("");
      carregar();
    } catch {
      setErro("Não foi possível criar. Já existe uma coleção com esse nome?");
    }
  }

  async function salvarRenome(id: string) {
    const nome = editNome.trim();
    if (!nome) return;
    try {
      await api.put(`/collections/${id}`, { name: nome });
      setEditandoId(null);
      carregar();
    } catch {
      setErro("Não foi possível renomear.");
    }
  }

  async function excluir(id: string, nome: string) {
    if (!window.confirm(`Excluir a coleção "${nome}"?`)) return;
    try {
      await api.delete(`/collections/${id}`);
      carregar();
    } catch {
      setErro("Não foi possível excluir.");
    }
  }

  return (
    <div>
      <h1 className={styles.titulo}>Minhas Coleções</h1>

      <form onSubmit={criar} className={styles.formCriar}>
        <input
          className={styles.input}
          placeholder="Nome da nova coleção"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />
        <button type="submit" className={styles.botaoCriar}>Criar</button>
      </form>

      {erro && <p className={styles.erro}>{erro}</p>}

      {carregando ? (
        <p>Carregando...</p>
      ) : colecoes.length === 0 ? (
        <p className={styles.vazio}>Você ainda não tem coleções. Crie uma acima!</p>
      ) : (
        <div className={styles.lista}>
          {colecoes.map((c) => (
            <div key={c.id} className={styles.card}>
              {editandoId === c.id ? (
                <div className={styles.editando}>
                  <input
                    className={styles.input}
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                  />
                  <button className={styles.botaoMini} onClick={() => salvarRenome(c.id)}>Salvar</button>
                  <button className={styles.botaoMiniSec} onClick={() => setEditandoId(null)}>Cancelar</button>
                </div>
              ) : (
                <>
                  <div className={styles.info}>
                    <strong className={styles.nome}>{c.name}</strong>
                    <span className={styles.contagem}>{c._count?.items ?? 0} figurinhas</span>
                  </div>
                  <div className={styles.acoes}>
                    <Link to={`/colecoes/${c.id}`} className={styles.botaoAbrir}>Abrir</Link>
                    <button
                      className={styles.botaoMiniSec}
                      onClick={() => {
                        setEditandoId(c.id);
                        setEditNome(c.name);
                      }}
                    >
                      Renomear
                    </button>
                    <button className={styles.botaoExcluir} onClick={() => excluir(c.id, c.name)}>
                      Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}