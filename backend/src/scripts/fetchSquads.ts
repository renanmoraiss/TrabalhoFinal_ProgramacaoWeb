import dotenv from "dotenv";
import { fetchTeams, fetchSquad } from "../services/apiFootball.service";

dotenv.config();

/**
 * baixa os elencos de seleções específicas da Copa 2022.
 * descobre os ids via /teams (1 req) e baixa cada seleção da lista.
 */


const WANTED_TEAMS = [
  "Brazil",
  "Argentina",
  "France",
  "England",
  "Spain",
  "Portugal",
  "Germany",
  "Netherlands",
  "Croatia",
  "Belgium",
  "Morocco",
  "Japan",
];

async function main() {
  const teams = await fetchTeams();
  console.log(`[squads] ${teams.length} seleções disponíveis na Copa 2022.`);

  const selected = teams.filter((t) => WANTED_TEAMS.includes(t.name));
  const notFound = WANTED_TEAMS.filter((n) => !teams.some((t) => t.name === n));

  if (notFound.length > 0) {
    console.warn(`[squads] Nomes não encontrados (confira a grafia): ${notFound.join(", ")}`);
  }

  console.log(`[squads] Baixando ${selected.length} seleções: ${selected.map((t) => t.name).join(", ")}`);
  console.log(`[squads] Custo estimado: ~${1 + selected.length * 2} requisições.`);

  for (const team of selected) {
    await fetchSquad(team.id, team.name);
  }

  console.log("[squads] Concluído. Agora rode: npm run curate:players");
}

main().catch((error) => {
  console.error("[fetchSquads] Erro fatal:", error instanceof Error ? error.message : error);
  process.exit(1);
});