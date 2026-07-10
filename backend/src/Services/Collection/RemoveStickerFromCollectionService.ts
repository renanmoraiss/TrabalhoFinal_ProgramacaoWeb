import {prismaClient} from "../../prisma/client";
import {RemoveStickerFromCollectionRequest} from "../../models/Collection/RemoveStickerFromCollectionRequest";

class RemoveStickerFromCollectionService {
    async execute({collectionId, userStickerId, userId}: RemoveStickerFromCollectionRequest) {
        if (!collectionId || !userStickerId || !userId) {
            throw new Error("Todos os dados são obrigatórios.")
        }

        const collectionSticker = await prismaClient.collectionSticker.findFirst({
            where: {
                collectionId,
                userStickerId,
                collection: {
                    userId
                },
                userSticker: {
                    userId
                }
            }
        });

        if (!collectionSticker) {
            throw new Error("A figurinha não foi encontrada nessa coleção.")
        }

        await prismaClient.collectionSticker.delete({
            where: {
                id: collectionSticker.id
            }
        });

        return {message:"Figurinha removida dessa coleção."};
    }
}

export {RemoveStickerFromCollectionService};