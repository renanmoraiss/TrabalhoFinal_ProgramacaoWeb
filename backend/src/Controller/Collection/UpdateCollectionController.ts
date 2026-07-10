import {Request,Response} from "express";
import {UpdateCollectionService} from "../../services/Collection/UpdateCollectionService";

class UpdateCollectionController {
    async handle(req: Request, res: Response) {
        const {id} = req.params;
        const {name} = req.body;
        const userId = req.userId;
        const service = new UpdateCollectionService();

        if (!userId) {
            return res.status(400).json({error: "Usuário não autenticado"});
        }

        if (!id || Array.isArray(id)) {
            return res.status(400).json({error: "Id da coleção do usuário é inválida"});
        }

        try {
            const resultado = await service.execute({
                id,
                name,
                userId
            });
            return res.json(resultado);
        } catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({error: error.message});
            }
            return res.status(400).json({error: "Erro ao atualizar a coleção do usuário"});
        }
    }
}

export {UpdateCollectionController};