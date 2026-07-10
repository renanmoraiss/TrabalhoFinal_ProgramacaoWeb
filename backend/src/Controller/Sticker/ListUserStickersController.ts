import {Request, Response} from "express";
import {ListUserStickersService} from "../../services/Sticker/ListUserStickersService";

class ListUserStickersController {
    async handle(req: Request, res: Response) {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({error: "Usuário não autenticado."});
        }

        const service = new ListUserStickersService();

        try {
            const resultado = await service.execute(userId);
            return res.json(resultado);
        } catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({error: error.message});
            }
            return res.status(400).json({error: "Erro ao listar inventário do usuário."});
        }
    }
}

export {ListUserStickersController};