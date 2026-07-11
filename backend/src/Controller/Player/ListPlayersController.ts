import { Request, Response } from "express";
import { ListPlayersService } from "../../Services/Player/ListPlayersService";

class ListPlayersController {
  async handle(req: Request, res: Response) {
    const service = new ListPlayersService();

    try {
      const players = await service.execute();
      return res.json(players);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Erro ao listar jogadores." });
    }
  }
}

export { ListPlayersController };