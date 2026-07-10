import { Router } from "express";
import { CreateUserController } from "./Controller/User/CreateUserController";
import { AuthController } from "./Controller/Auth/AuthController";

const router = Router();

//User Routes
router.post("/user/create", new CreateUserController().handle);
router.post("/user/session", new AuthController().handle);



export {router};