import {Request, Response} from "express";
import {ListCollectionService} from "../../services/Collection/ListCollectionService";

class ListCollectionController {
    async handle(req: Request, res: Response) {
        const userId = req.userId;
        const service = new ListCollectionService();

        if (!userId) {
            return res.status(400).json({error: "Usuário não autenticado"});
        }

        try {
            const resultado = await service.execute(userId);
            return res.json(resultado);
        } catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({error: error.message});
            }
            return res.status(400).json({error: "Erro ao listar as coleções do usuário"});
        }
    }
}

export {ListCollectionController};