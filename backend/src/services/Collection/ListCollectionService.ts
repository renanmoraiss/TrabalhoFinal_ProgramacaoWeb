import {prismaClient} from "../../prisma/client";

class ListCollectionService {
    async execute(userId: string) {
        if (!userId) {
            throw new Error("Usuário não autenticado.")
        }

        const collections = await prismaClient.collection.findMany({
            where: {
                userId
            },
            include: {
                _count: {
                    select: {
                        items: true
                    }
                }
            }
        });

        return collections;
    }
}

export {ListCollectionService};