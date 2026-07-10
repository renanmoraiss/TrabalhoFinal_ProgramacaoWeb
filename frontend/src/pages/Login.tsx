// src/pages/Cadastro.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../Schemas/Login.schema";
import { api } from "../Services/api";
import styles from "./Login.module.css"

export function Login() {
  const [email, setEmail] = useState("");
  const [passwordHash, setPasswordHash] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErro("");

    const resultado = loginSchema.safeParse({ email, passwordHash });

    if (!resultado.success) {
      const primeiroErro = resultado.error.issues[0].message;
      setErro(primeiroErro);
      return;
    }

    try {
      const resposta = await api.post("/user/session", resultado.data);
      localStorage.setItem("token", resposta.data.token)

      setSucesso("Usuário Logado com sucesso!");
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      console.error(error);
      setErro("Erro ao Logar. Tente novamente.");
    }
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.header}>
        <img src="../../public/Logo.jpg" alt="Logo do projeto" className={styles.logo} />
        <p className={styles.tituloProjeto}>Copa album - O sonho do Hexa</p>
      </header>

      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.formulario}>
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

          {erro && <p className={styles.erro}>{erro}</p>}
          {sucesso && <p className={styles.sucesso}>{sucesso}</p>}


          <button className={styles.botao} type="submit">Logar</button>
        </form>
        <Link to="/cadastro" className={styles.link}>Ainda não tem conta ? Clique aqui</Link>
      </div>
    </div>
  );
}