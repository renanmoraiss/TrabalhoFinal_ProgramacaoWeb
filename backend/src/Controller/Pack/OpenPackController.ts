import { Request, Response } from "express";
import { OpenPackService } from "../../Services/Pack/OpenPackService";

class OpenPackController {
  async handle(req: Request, res: Response) {

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    // N opcional no corpo; se não vier, usa o tamanho padrão do pacote
    const count = Number(req.body?.count) || undefined;

    const service = new OpenPackService();

    try {
      const result = await service.execute(userId, count);
      return res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(400).json({ error: "Erro ao abrir pacote." });
    }
  }
}

export { OpenPackController };