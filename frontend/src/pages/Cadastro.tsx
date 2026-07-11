import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cadastroSchema } from "../Schemas/Cadastro.schema";
import { api } from "../Services/api";
import styles from "./Cadastro.module.css";

export function Cadastro() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro("");

    const resultado = cadastroSchema.safeParse({ username, email, passwordHash, confirmPassword });

    if (!resultado.success) {
      const primeiroErro = resultado.error.issues[0].message;
      setErro(primeiroErro);
      return;
    }

    try {
        await api.post("/user/create", {
          username: resultado.data.username,
          email: resultado.data.email,
          passwordHash: resultado.data.passwordHash,
        });
        setSucesso("Usuário cadastrado com sucesso!");
  
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    } catch (error) {
  console.error(error);
  setErro("Erro ao cadastrar. Tente novamente.");
}
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.header}>
        <img src="../../public/Logo.jpg" alt="Logo do projeto" className={styles.logo} />
        <p className={styles.tituloProjeto}>Copa Álbum - O Sonho do Hexa</p>
      </header>

      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.formulario}>
          <div className={styles.campo}>
            <label className={styles.nome}>Usuário</label>
            <input className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className={styles.campo}>
            <label>Email</label>
            <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className={styles.campo}>
            <label>Senha</label>
            <input className={styles.input}
              type="password"
              value={passwordHash}
              onChange={(e) => setPasswordHash(e.target.value)}
            />
          </div>

          <div className={styles.campo}>
            <label>Confirmação de Senha</label>
            <input className={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

            {erro && <p className={styles.erro}>{erro}</p>}
            {sucesso && <p className={styles.sucesso}>{sucesso}</p>}


          <button className= {styles.botao} type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}