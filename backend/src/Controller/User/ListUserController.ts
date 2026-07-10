import { Request, Response } from "express";
import { ListUserService } from "../../Services/User/ListUserService";

class ListUserController{
    async handle(req: Request, res: Response){
        const userId = req.userId as string;
        const listUserService = new ListUserService();
        const listed = await listUserService.execute(userId);
        return res.status(200).json(listed);
    }
}

export {ListUserController}