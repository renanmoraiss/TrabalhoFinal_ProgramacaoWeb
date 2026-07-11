import fs from "fs";
import path from "path";

/**
 * Etapa 2 - Curadoria.
 *
 * Lê TODOS os JSONs brutos em backend/prisma/data/raw/ (gerados pela integracao com a api),
 * aplica as regras de limpeza (nao incluir jogador sem foto etc) e produz um único arquivo limpo:
 *   backend/prisma/data/players.curated.json
 */

const RAW_DIR = path.resolve(__dirname, "../../prisma/data/raw");
const OUTPUT_FILE = path.resolve(__dirname, "../../prisma/data/players.curated.json");

/** Formato final, espelhando o model Player do schema.prisma. */
interface CuratedPlayer {
  id: string;
  name: string;
  team: string;
  photo: string;
  position: string | null;
}

/** Lê todas as páginas brutas e junta os arrays `response` num só. */
function readRawEntries(): any[] {
  if (!fs.existsSync(RAW_DIR)) {
    throw new Error(
      `Pasta ${RAW_DIR} não existe. Rode antes o download: npm run fetch:players`,
    );
  }

  const files = fs
    .readdirSync(RAW_DIR)
    .filter((f) => f.startsWith("players") && f.endsWith(".json"))
    // ordena por número da página só pra o log ficar organizado
    .sort((a, b) => {
      const na = Number(a.replace(/\D/g, ""));
      const nb = Number(b.replace(/\D/g, ""));
      return na - nb;
    });

  if (files.length === 0) {
    throw new Error(
      `Nenhum players_page_*.json em ${RAW_DIR}. Rode antes o download: npm run fetch:players`,
    );
  }

  const entries: any[] = [];
  for (const file of files) {
    const full = path.join(RAW_DIR, file);
    const content = JSON.parse(fs.readFileSync(full, "utf-8"));
    const response = content?.response ?? [];
    entries.push(...response);
  }

  console.log(`[curate] Páginas lidas: ${files.length} | entradas brutas: ${entries.length}`);
  return entries;
}

/** Aplica as regras e devolve a lista limpa de jogadores. */
function curate(rawEntries: any[]): CuratedPlayer[] {
  const byId = new Map<string, CuratedPlayer>();
  let semId = 0;
  let semFoto = 0;
  let semSelecao = 0;
  let duplicados = 0;

  for (const entry of rawEntries) {
    const player = entry?.player;
    const stats = entry?.statistics?.[0];

    // sem id não dá pra mapear (id do Player = id da API)
    if (!player?.id) {
      semId++;
      continue;
    }

    // descarta sem foto
    const photo = player?.photo;
    if (!photo || String(photo).trim() === "") {
      semFoto++;
      continue;
    }

    // descarta sem seleção resolvível
    const team = stats?.team?.name;
    if (!team || String(team).trim() === "") {
      semSelecao++;
      continue;
    }

    // deduplica por id
    const id = String(player.id);
    if (byId.has(id)) {
      duplicados++;
      continue;
    }

    byId.set(id, {
      id,
      name: player.name,
      team,
      photo,
      position: stats?.games?.position ?? null,
    });
  }

  console.log(`[curate] Descartados sem id: ${semId}`);
  console.log(`[curate] Descartados sem foto: ${semFoto}`);
  console.log(`[curate] Descartados sem seleção: ${semSelecao}`);
  console.log(`[curate] Duplicados ignorados: ${duplicados}`);
  console.log(`[curate] Jogadores finais: ${byId.size}`);

  return Array.from(byId.values());
}

function main() {
  const rawEntries = readRawEntries();
  const curated = curate(rawEntries);

  // ordena por seleção e depois nome, só pra o arquivo ficar previsível/legível
  curated.sort(
    (a, b) => a.team.localeCompare(b.team) || a.name.localeCompare(b.name),
  );

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(curated, null, 2), "utf-8");

  console.log(`[curate] Arquivo gerado: ${OUTPUT_FILE}`);
}

try {
  main();
} catch (error) {
  console.error(
    "[curatePlayers] Erro:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
}