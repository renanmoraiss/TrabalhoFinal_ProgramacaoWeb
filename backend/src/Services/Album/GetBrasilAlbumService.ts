import {prismaClient} from "../../prisma/client";

class GetBrasilAlbumService {
    async execute(userId: string) {
        if (!userId) {
            throw new Error("Usuário não autenticado.")
        }

        const selecaoBrasil = ["Brasil", "Brazil"];

        const players = await prismaClient.player.findMany({
            where: {
                team: {
                    in: selecaoBrasil
                }
            }
        });

        const userStickers = await prismaClient.userSticker.findMany({
            where: {
                userId,
                player: {
                    team: {
                        in: selecaoBrasil
                    }
                }
            },
            include: {
                player: true
            }
        });

        const playersId = new Set(
            userStickers.map((sticker) => sticker.playerId)
        )

        const posicoes = players.map((player) => {
            const userSticker = userStickers.find(
                (sticker) => sticker.playerId === player.id
            );

            return {
                player,
                possuiNoInventario: playersId.has(player.id),
                userSticker: userSticker || null
            };
        });

        const totalPlayers = players.length;
        const totalInventario = playersId.size;
        const porcentagem = totalPlayers > 0 ? Number(((totalInventario / totalPlayers) * 100).toFixed(2)) : 0;
    

        return {
            team: "Brasil",
            totalPlayers,
            totalInventario,
            totalFaltando: totalPlayers - totalInventario,
            porcentagem,
            posicoes
        };
    }
}

export {GetBrasilAlbumService};