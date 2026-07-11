import { prismaClient } from "../../prisma/client";

//lê o catálogo de jogadores do banco. retorna todos os Player, ordenados por seleção e depois nome.

class ListPlayersService {
  async execute() {
    const players = await prismaClient.player.findMany({
      orderBy: [{ team: "asc" }, { name: "asc" }],
    });

    return players;
  }
}

export { ListPlayersService };