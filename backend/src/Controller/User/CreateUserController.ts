import { CreateUserService } from "../../services/User/CreateUserService";
import { Request, Response } from "express";
import { CreateUserRequest } from "../../models/user/CreateUserRequest";

class CreateUserController{
    async handle(req: Request, res: Response){
        const {username, email, passwordHash}: CreateUserRequest = req.body;
        const createUserService = new CreateUserService();
        const user = await createUserService.execute({username, email, passwordHash});
        return res.status(200).json(user);
    }
}

export {CreateUserController}