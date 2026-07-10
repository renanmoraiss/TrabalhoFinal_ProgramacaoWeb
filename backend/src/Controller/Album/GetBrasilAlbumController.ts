import {Request,Response} from "express";
import {GetBrasilAlbumService} from "../../services/Album/GetBrasilAlbumService";

class GetBrasilAlbumController {
    async handle(req: Request, res: Response) {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({error: "Usuário não autenticado."})
        }

        const service = new GetBrasilAlbumService();

        try {
            const resultado = await service.execute(userId);
            return res.json(resultado);
        } catch(error) {
            if (error instanceof Error) {
                return res.status(400).json({error: error.message});
            }
            return res.status(400).json({error: "Erro ao buscar o álbum da Seleção Brasileira"});
        }
    }
}

export {GetBrasilAlbumController};