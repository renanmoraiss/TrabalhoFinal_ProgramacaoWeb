import { Request, Response } from "express";
import { EditUserService } from "../../services/User/EditUserService";
import { EditUserRequest } from "../../models/user/EditUserRequest";


class EditUserController{
    async handle(req: Request, res: Response){
        const {username, email}: EditUserRequest = req.body;
        const userId = req.userId as string;
        const editUserService = new EditUserService();
        const edited = await editUserService.execute({userId, username, email})
        return res.status(200).json(edited);
    }
}

export {EditUserController}