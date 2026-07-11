import fs from "fs";
import path from "path";

/**
 * integração com a API-Football (api-sports.io). baixa e salva em json
 *
 * Plano gratuito: 100 req/dia, 10 req/min, season só 2022–2024, e no endpoint
 * de players só as páginas 1..3. Por isso: throttle (pausa), tolerância a falha por
 * página, e cap de páginas.
 */

const BASE_URL = "https://v3.football.api-sports.io/players";
const TEAMS_URL = "https://v3.football.api-sports.io/teams";

const DEFAULT_LEAGUE = 1; // 1 = World Cup
const DEFAULT_SEASON = 2022; // plano grátis não libera 2026; 2022 = Copa do Catar
const DEFAULT_THROTTLE_MS = 7000; // ~7s => respeita 10 req/min

const FREE_PLAN_MAX_PAGE = 3;

const RAW_DIR = path.resolve(__dirname, "../../prisma/data/raw");

export interface FetchOptions {
  league?: number;
  season?: number;
  throttleMs?: number;
  maxPages?: number;
}

interface PageResult {
  page: number;
  ok: boolean;
  file?: string;
  playersInPage?: number;
  error?: string;
}

function getApiKey(): string {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key || key.trim() === "") {
    throw new Error(
      "API_FOOTBALL_KEY não definida. Configure a chave no arquivo backend/.env (veja .env.example). Nunca coloque a chave no código.",
    );
  }
  return key.trim();
}

function ensureRawDir(): void {
  fs.mkdirSync(RAW_DIR, { recursive: true });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** a API-Football responde 200 com um campo `errors` preenchido em falhas. */
function assertNoApiErrors(body: any): void {
  const errors = body?.errors;
  const hasErrors =
    errors &&
    ((Array.isArray(errors) && errors.length > 0) ||
      (!Array.isArray(errors) && Object.keys(errors).length > 0));
  if (hasErrors) {
    throw new Error(`API retornou erros: ${JSON.stringify(errors)}`);
  }
}

/** Salva um corpo JSON bruto com um nome de arquivo dado (sem extensão). */
function saveRaw(baseName: string, body: any): string {
  ensureRawDir();
  const file = path.join(RAW_DIR, `${baseName}.json`);
  fs.writeFileSync(file, JSON.stringify(body, null, 2), "utf-8");
  return file;
}

/** Baixa uma página do endpoint /players (por liga). */
async function fetchPage(page: number, league: number, season: number): Promise<any> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}?league=${league}&season=${season}&page=${page}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "x-apisports-key": apiKey },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  const body = await response.json();
  assertNoApiErrors(body);
  return body;
}

/**
 * TESTE DE 1 REQUISIÇÃO. Baixa só a página 1 (por liga) pra inspecionar.
 */
export async function fetchTestPage(
  options: FetchOptions = {},
): Promise<{ file: string; paging: any; sampleCount: number; firstPlayer: any }> {
  const league = options.league ?? DEFAULT_LEAGUE;
  const season = options.season ?? DEFAULT_SEASON;

  console.log(`[apiFootball] TESTE: baixando página 1 (league=${league}, season=${season})...`);

  const body = await fetchPage(1, league, season);
  const file = saveRaw("players_page_1", body);

  const response = body?.response ?? [];
  console.log(`[apiFootball] TESTE ok. Salvo em: ${file}`);
  console.log(`[apiFootball] paging: ${JSON.stringify(body?.paging)}`);
  console.log(`[apiFootball] jogadores nesta página: ${response.length}`);

  return {
    file,
    paging: body?.paging,
    sampleCount: response.length,
    firstPlayer: response[0] ?? null,
  };
}

/**
 * DOWNLOAD por LIGA (paginado). Cap de páginas pelo plano gratuito.
 */
export async function fetchAllPlayers(options: FetchOptions = {}): Promise<PageResult[]> {
  const league = options.league ?? DEFAULT_LEAGUE;
  const season = options.season ?? DEFAULT_SEASON;
  const throttleMs = options.throttleMs ?? DEFAULT_THROTTLE_MS;

  const results: PageResult[] = [];
  console.log(`[apiFootball] Iniciando download (league=${league}, season=${season}, throttle=${throttleMs}ms)`);

  let totalPages: number;
  try {
    const firstBody = await fetchPage(1, league, season);
    const file = saveRaw("players_page_1", firstBody);
    totalPages = firstBody?.paging?.total ?? 1;
    results.push({ page: 1, ok: true, file, playersInPage: (firstBody?.response ?? []).length });
    console.log(`[apiFootball] Página 1/${totalPages} salva (${(firstBody?.response ?? []).length} jogadores).`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[apiFootball] Falha na página 1 (não foi possível descobrir o total): ${message}`);
    results.push({ page: 1, ok: false, error: message });
    return results;
  }

  const maxPages = options.maxPages ?? FREE_PLAN_MAX_PAGE;
  if (maxPages < totalPages) {
    totalPages = maxPages;
    console.log(`[apiFootball] Limitado a ${totalPages} páginas (plano gratuito).`);
  }

  for (let page = 2; page <= totalPages; page++) {
    await sleep(throttleMs);
    try {
      const body = await fetchPage(page, league, season);
      const file = saveRaw(`players_page_${page}`, body);
      const count = (body?.response ?? []).length;
      results.push({ page, ok: true, file, playersInPage: count });
      console.log(`[apiFootball] Página ${page}/${totalPages} salva (${count} jogadores).`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[apiFootball] Falha na página ${page}: ${message}`);
      results.push({ page, ok: false, error: message });
    }
  }

  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok).length;
  console.log(`[apiFootball] Concluído. Páginas OK: ${ok}, com falha: ${fail}. Brutos em: ${RAW_DIR}`);
  return results;
}

/**
 * Descobre as seleções de uma liga/temporada (endpoint /teams). 1 requisição.
 * Usado pra pegar os ids reais das seleções sem chutar.
 */
export async function fetchTeams(
  league: number = DEFAULT_LEAGUE,
  season: number = DEFAULT_SEASON,
): Promise<{ id: number; name: string }[]> {
  const apiKey = getApiKey();
  const url = `${TEAMS_URL}?league=${league}&season=${season}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "x-apisports-key": apiKey },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  const body = await response.json();
  assertNoApiErrors(body);
  saveRaw("teams", body);

  return (body?.response ?? []).map((r: any) => ({
    id: r?.team?.id,
    name: r?.team?.name,
  }));
}

/**
 * Baixa o elenco de UMA seleção (endpoint /players?team=...), paginando até o
 * fim (respeitando o cap de 3 páginas). Salva players_team{id}_page{n}.json.
 * Tolerante a falha por página.
 */
export async function fetchSquad(
  teamId: number,
  teamName: string,
  season: number = DEFAULT_SEASON,
  throttleMs: number = DEFAULT_THROTTLE_MS,
): Promise<void> {
  const apiKey = getApiKey();

  const fetchTeamPage = async (page: number): Promise<any> => {
    const url = `${BASE_URL}?team=${teamId}&season=${season}&page=${page}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "x-apisports-key": apiKey },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    const body = await response.json();
    assertNoApiErrors(body);
    return body;
  };

  await sleep(throttleMs);

  let totalPages = 1;
  try {
    const first = await fetchTeamPage(1);
    saveRaw(`players_team${teamId}_page1`, first);
    totalPages = Math.min(first?.paging?.total ?? 1, FREE_PLAN_MAX_PAGE);
    console.log(`[squad] ${teamName}: página 1/${totalPages} (${(first?.response ?? []).length} jogadores).`);
  } catch (error) {
    console.error(`[squad] ${teamName}: falha na página 1: ${error instanceof Error ? error.message : error}`);
    return;
  }

  for (let page = 2; page <= totalPages; page++) {
    await sleep(throttleMs);
    try {
      const body = await fetchTeamPage(page);
      saveRaw(`players_team${teamId}_page${page}`, body);
      console.log(`[squad] ${teamName}: página ${page}/${totalPages} (${(body?.response ?? []).length} jogadores).`);
    } catch (error) {
      console.error(`[squad] ${teamName}: falha na página ${page}: ${error instanceof Error ? error.message : error}`);
    }
  }
}

export { RAW_DIR };