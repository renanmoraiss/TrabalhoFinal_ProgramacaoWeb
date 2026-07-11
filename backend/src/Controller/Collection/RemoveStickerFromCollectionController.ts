import {Request,Response} from "express";
import {RemoveStickerFromCollectionService} from "../../services/Collection/RemoveStickerFromCollectionService";

class RemoveStickerFromCollectionController {
    async handle(req: Request, res: Response) {
        const {id} = req.params;
        const {userStickerId} = req.params;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({error: "Usuário não autenticado."});
        }

        if (!id || Array.isArray(id)) {
            return res.status(400).json({error: "O id da coleção é inválido."});
        }

        if (!userStickerId || Array.isArray(userStickerId)) {
            return res.status(400).json({error: "O id da figurinha é inválido."});
        }

        const service = new RemoveStickerFromCollectionService();

        try {
            const resultado = await service.execute({
                collectionId: id,
                userStickerId,
                userId
            });
            return res.json(resultado);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({error: error.message});
            }
            return res.status(400).json({error: "Erro ao remover a figurinha da coleção."});
        }
    }
}

export {RemoveStickerFromCollectionController};