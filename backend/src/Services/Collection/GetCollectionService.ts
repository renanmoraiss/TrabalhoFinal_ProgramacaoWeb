import {prismaClient} from "../../prisma/client";

class GetCollectionService {
    async execute(id: string, userId: string) {
        if (!id || !userId) {
            throw new Error("Coleção não encontrada.")
        }

        const collection = await prismaClient.collection.findFirst({
            where: {
                id,
                userId
            },
            include: {
                items: {
                    include: {
                        userSticker: {
                            include: {
                                player: true
                            }
                        }
                    }
                }
            }
        });

        if (!collection) {
            throw new Error("Coleção não encontrada.")
        }

        return collection;
    }
}

export {GetCollectionService};