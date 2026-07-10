import { Request, Response } from "express";
import { DeleteUserService } from "../../Services/User/DeleteUserService";

class DeleteUserController{
    async handle(req: Request, res: Response){
        const userId = req.userId as string;
        const deleteUserService = new DeleteUserService();
        const removed = await deleteUserService.execute(userId);
        return res.status(200).json(removed);
    }
}

export {DeleteUserController}