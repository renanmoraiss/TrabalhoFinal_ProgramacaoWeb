import fs from "fs";
import path from "path";

// * Restrições da cota gratuita da API-Football: - 100 requisições por dia - 10 requisições por minuto
// por isso download é feito com pausa entre paginas e cada pagina é salva assim que chega. aqui iremos baixar as páginas de jogadores da API
// e salvar o JSON BRUTO em backend/prisma/data/raw/

const BASE_URL = "https://v3.football.api-sports.io/players";

const DEFAULT_LEAGUE = 1; // 1 = World Cup na API-Football
const DEFAULT_SEASON = 2022;

// 10 req/min = no mínimo 7s entre chamadas.
const DEFAULT_THROTTLE_MS = 7000;

// Diretório de saída
const RAW_DIR = path.resolve(__dirname, "../../prisma/data/raw");

export interface FetchOptions {
  league?: number;
  season?: number;
  throttleMs?: number;
  /** limite de pag pra testes sem gastar muita cota*/
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

/**
 * baixa uma página da API e devolve o corpo JSON já parseado.
 * lança erro se a api ou o http falhar
 */
async function fetchPage(
  page: number,
  league: number,
  season: number,
): Promise<any> {
  const apiKey = getApiKey();
  const url = `${BASE_URL}?league=${league}&season=${season}&page=${page}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-apisports-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const body = await response.json();

  const errors = body?.errors;
  const hasErrors =
    errors &&
    ((Array.isArray(errors) && errors.length > 0) ||
      (!Array.isArray(errors) && Object.keys(errors).length > 0));

  if (hasErrors) {
    throw new Error(`API retornou erros: ${JSON.stringify(errors)}`);
  }

  return body;
}

function savePage(page: number, body: any): string {
  ensureRawDir();
  const file = path.join(RAW_DIR, `players_page_${page}.json`);
  fs.writeFileSync(file, JSON.stringify(body, null, 2), "utf-8");
  return file;
}

/**
 * teste de 1 requisição.
 * baixa apenas a página 1 e salva. serve pra inspecionar a estrutura real da
 * resposta (confirmar onde está a seleção, a foto, etc.) gastando só 1
 * requisição da cota antes de qualquer download completo.
 */
export async function fetchTestPage(
  options: FetchOptions = {},
): Promise<{ file: string; paging: any; sampleCount: number; firstPlayer: any }> {
  const league = options.league ?? DEFAULT_LEAGUE;
  const season = options.season ?? DEFAULT_SEASON;

  console.log(
    `[apiFootball] TESTE: baixando página 1 (league=${league}, season=${season})...`,
  );

  const body = await fetchPage(1, league, season);
  const file = savePage(1, body);

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
 * DOWNLOAD COMPLETO (paginado).
 * Baixa a página 1, descobre o total de páginas em `paging.total` e itera até
 * o fim, com throttle entre as chamadas. Cada página é salva assim que chega.
 * Falha em uma página é tolerada (loga e continua).
 */
export async function fetchAllPlayers(
  options: FetchOptions = {},
): Promise<PageResult[]> {
  const league = options.league ?? DEFAULT_LEAGUE;
  const season = options.season ?? DEFAULT_SEASON;
  const throttleMs = options.throttleMs ?? DEFAULT_THROTTLE_MS;

  const results: PageResult[] = [];

  console.log(
    `[apiFootball] Iniciando download (league=${league}, season=${season}, throttle=${throttleMs}ms)`,
  );

  // Página 1: precisamos dela pra descobrir o total de páginas.
  let totalPages: number;
  try {
    const firstBody = await fetchPage(1, league, season);
    const file = savePage(1, firstBody);
    totalPages = firstBody?.paging?.total ?? 1;
    results.push({
      page: 1,
      ok: true,
      file,
      playersInPage: (firstBody?.response ?? []).length,
    });
    console.log(
      `[apiFootball] Página 1/${totalPages} salva (${(firstBody?.response ?? []).length} jogadores).`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `[apiFootball] Falha na página 1 (não foi possível descobrir o total): ${message}`,
    );
    results.push({ page: 1, ok: false, error: message });
    return results;
  }

  if (options.maxPages && options.maxPages < totalPages) {
    totalPages = options.maxPages;
    console.log(`[apiFootball] Limitado a ${totalPages} páginas (maxPages).`);
  }

  for (let page = 2; page <= totalPages; page++) {
    await sleep(throttleMs); // respeita o limite de 10 req/min

    try {
      const body = await fetchPage(page, league, season);
      const file = savePage(page, body);
      const count = (body?.response ?? []).length;
      results.push({ page, ok: true, file, playersInPage: count });
      console.log(
        `[apiFootball] Página ${page}/${totalPages} salva (${count} jogadores).`,
      );
    } catch (error) {
      // Tolerância a falha: loga e continua, sem perder o já baixado.
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[apiFootball] Falha na página ${page}: ${message}`);
      results.push({ page, ok: false, error: message });
    }
  }

  const ok = results.filter((r) => r.ok).length;
  const fail = results.filter((r) => !r.ok).length;
  console.log(
    `[apiFootball] Concluído. Páginas OK: ${ok}, com falha: ${fail}. Brutos em: ${RAW_DIR}`,
  );

  return results;
}

export { RAW_DIR };