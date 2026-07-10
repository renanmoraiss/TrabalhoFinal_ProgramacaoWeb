import {Request, Response} from "express";
import {CreateCollectionService} from "../../services/Collection/CreateCollectionService";

class CreateCollectionController {
    async handle(req: Request, res: Response) {
        const {name} = req.body;
        const userId = req.userId;
        const service = new CreateCollectionService();

        if (!userId) {
            return res.status(400).json({error: "Usuário não autenticado"});
        }

        try {
            const resultado = await service.execute({
                name,
                userId
            });

            return res.status(201).json(resultado);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({error: error.message});
            }

            return res.status(400).json({error: "Erro ao criar coleção."});
        }
    }
}

export {CreateCollectionController};