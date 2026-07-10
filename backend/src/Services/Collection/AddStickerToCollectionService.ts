import {prismaClient} from "../../prisma/client";
import {AddStickerToCollectionRequest} from "../../models/Collection/AddStickerToCollectionRequest";

class AddStickerToCollectionService {
    async execute({collectionId, userStickerId, userId}: AddStickerToCollectionRequest) {
        if (!collectionId || !userStickerId || !userId) {
            throw new Error("Todos os dados são obrigatórios.")
        }

        const collection = await prismaClient.collection.findFirst({
            where: {
                id: collectionId,
                userId
            }
        });

        if (!collection) {
            throw new Error("A coleção do usuário não foi encontrada.")
        }

        const userSticker = await prismaClient.userSticker.findFirst({
            where: {
                id: userStickerId,
                userId
            }
        });

        if (!userSticker) {
            throw new Error("O usuário não possui a figurinha no inventário.")
        }

        const stickerEstaNaColecao = await prismaClient.collectionSticker.findFirst({
            where: {
                collectionId,
                userStickerId
            }
        });

        if (stickerEstaNaColecao) {
            throw new Error("A figurinha já está na coleção.")
        }

        const collectionSticker = await prismaClient.collectionSticker.create({
            data: {
                collectionId,
                userStickerId
            },
            include: {
                userSticker: {
                    include: {
                        player: true
                    }
                }
            }
        });
        return collectionSticker;
    }
}

export {AddStickerToCollectionService};