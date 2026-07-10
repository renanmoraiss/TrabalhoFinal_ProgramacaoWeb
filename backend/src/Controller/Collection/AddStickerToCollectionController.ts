import {Request,Response} from "express";
import {AddStickerToCollectionService} from "../../services/Collection/AddStickerToCollectionService";

class AddStickerToCollectionController {
    async handle(req: Request, res: Response) {
        const {id} = req.params;
        const {userStickerId} = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({error: "Usuário não foi encontrado"});
        }

        if (!id || Array.isArray(id)) {
            return res.status(400).json({error: "O id da coleção é inválido"});
        }

        const service = new AddStickerToCollectionService();

        try {
            const resultado = await service.execute({
                collectionId: id,
                userStickerId,
                userId
            });
            return res.status(201).json(resultado);
        } catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({error: error.message});
            }
            return res.status(400).json({error: "Erro ao adicionar figurinha na coleção"});
        }
    }
}

export {AddStickerToCollectionController};