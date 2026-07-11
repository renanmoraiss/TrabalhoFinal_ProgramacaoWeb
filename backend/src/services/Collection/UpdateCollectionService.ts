import {prismaClient} from "../../prisma/client";
import {UpdateCollectionRequest} from "../../models/Collection/UpdateCollectionRequest";

class UpdateCollectionService {
    async execute({id, name, userId}: UpdateCollectionRequest) {
        if (!id || !userId) {
            throw new Error("Coleção não encontrada.")
        }

        if (!name) {
            throw new Error("Nome da coleção é obrigatório.")
        }

        if (name.trim().length < 4) {
            throw new Error("O nome da coleção deve ter no mínimo 4 caracteres")
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

        const collectionNomeExiste = await prismaClient.collection.findFirst({
            where: {
                userId,
                name: name.trim(),
                id: {
                    not: id
                }
            }
        });

        if (collectionNomeExiste) {
            throw new Error("Já existe coleção com esse nome.")
        }

        const collectionAtualizada = await prismaClient.collection.update({
            where: {
                id
            },
            data: {
                name: name.trim()
            }
        });

        return collectionAtualizada;
    }
}

export {UpdateCollectionService};