import {prismaClient} from "../../prisma/client";
import {CreateCollectionRequest} from "../../models/Collection/CreateCollectionRequest";

class CreateCollectionService {
    async execute({name, userId}: CreateCollectionRequest) {
        if (!name || !userId) {
            throw new Error("Campos obrigatórios não podem estar vazios.")
        }

        if (name.trim().length < 4) {
            throw new Error("O nome da coleção deve ter no mínimo 4 caracteres.")
        }

        const collectionExiste = await prismaClient.collection.findFirst({
            where: {
                userId,
                name: name.trim()
            }
        });

        if (collectionExiste) {
            throw new Error("Já existe uma coleção com esse nome.")
        }

        const collection = await prismaClient.collection.create({
            data: {
                name: name.trim(),
                userId
            }
        });

        return collection;
    }
}

export {CreateCollectionService};