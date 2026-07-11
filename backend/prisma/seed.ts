import fs from "fs";
import path from "path";
import { prismaClient } from "../src/prisma/client";

 //*popula a tabela player lendo o json de jogadores


const CURATED_FILE = path.resolve(__dirname, "data/players.curated.json");

/** Espelha o formato gravado pelo curatePlayers.ts (e o model Player). */
interface CuratedPlayer {
  id: string;
  name: string;
  team: string;
  photo: string;
  position: string | null;
}

async function main() {
  if (!fs.existsSync(CURATED_FILE)) {
    throw new Error(
      `Arquivo ${CURATED_FILE} não encontrado. Rode antes: npm run curate:players`,
    );
  }

  const players: CuratedPlayer[] = JSON.parse(
    fs.readFileSync(CURATED_FILE, "utf-8"),
  );

  console.log(`[seed] ${players.length} jogadores lidos de players.curated.json`);

  for (const p of players) {
    await prismaClient.player.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        team: p.team,
        photo: p.photo,
        position: p.position ?? null,
      },
      create: {
        id: p.id,
        name: p.name,
        team: p.team,
        photo: p.photo,
        position: p.position ?? null,
      },
    });
  }

  const total = await prismaClient.player.count();
  console.log(`[seed] Concluído (idempotente). Total de Player no banco: ${total}`);
}

main()
  .catch((error) => {
    console.error("[seed] Erro:", error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });