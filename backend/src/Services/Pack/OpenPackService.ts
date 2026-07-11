import { prismaClient } from "../../prisma/client";
import { drawPack, DEFAULT_PACK_SIZE } from "../pack.service";

/**
 * lê o catálogo, sorteia N figurinhas e
 * grava cada uma no inventário do usuário (UserSticker) com upsert por
 * (userId, playerId): se não existe, cria com quantity 1; se já existe,
 * incrementa a quantity.
 */
class OpenPackService {
  async execute(userId: string, count: number = DEFAULT_PACK_SIZE) {
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    const players = await prismaClient.player.findMany();
    if (players.length === 0) {
      throw new Error("Não há jogadores no catálogo. Rode o seed antes.");
    }

    const figurinhas = drawPack(players, count);

    // grava cada figurinha no inventário; repetição vira quantity++
    for (const player of figurinhas) {
      await prismaClient.userSticker.upsert({
        where: {
          userId_playerId: { userId, playerId: player.id },
        },
        update: {
          quantity: { increment: 1 },
        },
        create: {
          userId,
          playerId: player.id,
          quantity: 1,
        },
      });
    }

    return {
      opened: figurinhas.length,
      figurinhas,
    };
  }
}

export { OpenPackService };