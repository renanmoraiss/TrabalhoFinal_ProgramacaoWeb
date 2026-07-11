import {prismaClient} from "../../prisma/client";

class DeleteCollectionService {
    async execute(id: string, userId: string) {
        if (!id || !userId) {
            throw new Error("Coleção não encontrada.")
        }

        const collection = await prismaClient.collection.findFirst({
            where: {
                id,
                userId
            }
        });

        if (!collection) {
            throw new Error("Coleção não encontrada.")
        }

        await prismaClient.collection.delete({
            where: {
                id
            }
        });

        return {message: "Coleção removida."};
    }
}

export {DeleteCollectionService};