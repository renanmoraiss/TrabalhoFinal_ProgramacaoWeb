import dotenv from "dotenv";
import { fetchAllPlayers, fetchTestPage } from "../services/apiFootball.service";

dotenv.config();

/**
 * Runner de linha de comando para o download de jogadores da API-Football.
 *
 *   npm run fetch:players:test   -> baixa SÓ a página 1 (gasta 1 requisição)
 *   npm run fetch:players        -> download completo (paginado, com throttle)
 *
 * O modo é escolhido pelo argumento "--test".
 */
async function main() {
  const isTest = process.argv.includes("--test");

  if (isTest) {
    const result = await fetchTestPage();
    console.log("\n===== RESUMO DO TESTE =====");
    console.log("Arquivo salvo:", result.file);
    console.log("Paging:", JSON.stringify(result.paging));
    console.log("Jogadores na página:", result.sampleCount);
    console.log(
      "\nAbra o arquivo acima para inspecionar a estrutura (ex.: response[0].statistics[0].team.name).",
    );
    return;
  }

  await fetchAllPlayers();
}

main().catch((error) => {
  console.error("[fetchPlayers] Erro fatal:", error instanceof Error ? error.message : error);
  process.exit(1);
});